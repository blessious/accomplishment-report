import JSZip from "jszip";
import {
  dayName,
  formatLongDate,
  formatPeriod,
  isWeekend,
  type Employee,
  type Holiday,
  type Office,
  type Report,
} from "./lgu-data";

interface ExportArgs {
  report: Report;
  employee: Employee;
  office: Office | undefined;
  holidays: Holiday[];
}

const WORD_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const XML_NS = "http://www.w3.org/XML/1998/namespace";

function wordElements(parent: Element, name: string) {
  return Array.from(parent.getElementsByTagNameNS(WORD_NS, name));
}

function directWordElements(parent: Element, name: string) {
  return Array.from(parent.children).filter(
    (child) => child.namespaceURI === WORD_NS && child.localName === name,
  );
}

function paragraphText(paragraph: Element) {
  return wordElements(paragraph, "t")
    .map((node) => node.textContent ?? "")
    .join("");
}

function setParagraphText(paragraph: Element, value: string) {
  const textRuns = wordElements(paragraph, "t");
  if (!textRuns.length) return;
  textRuns[0]!.textContent = value;
  if (/^\s|\s$/.test(value)) textRuns[0]!.setAttributeNS(XML_NS, "xml:space", "preserve");
  for (const textRun of textRuns.slice(1)) textRun.remove();
}

function setAlignment(paragraph: Element, value: "center" | "both") {
  let properties = directWordElements(paragraph, "pPr")[0];
  if (!properties) {
    properties = paragraph.ownerDocument.createElementNS(WORD_NS, "w:pPr");
    paragraph.insertBefore(properties, paragraph.firstChild);
  }
  let alignment = directWordElements(properties, "jc")[0];
  if (!alignment) {
    alignment = paragraph.ownerDocument.createElementNS(WORD_NS, "w:jc");
    properties.append(alignment);
  }
  alignment.setAttributeNS(WORD_NS, "w:val", value);
}

function setBold(paragraph: Element) {
  for (const run of directWordElements(paragraph, "r")) {
    let properties = directWordElements(run, "rPr")[0];
    if (!properties) {
      properties = paragraph.ownerDocument.createElementNS(WORD_NS, "w:rPr");
      run.insertBefore(properties, run.firstChild);
    }
    if (!directWordElements(properties, "b")[0]) {
      properties.append(paragraph.ownerDocument.createElementNS(WORD_NS, "w:b"));
    }
  }
}

function setNotBold(paragraph: Element) {
  const paragraphProperties = directWordElements(paragraph, "pPr")[0];
  directWordElements(paragraphProperties ?? paragraph, "rPr")[0]
    ?.getElementsByTagNameNS(WORD_NS, "b")[0]
    ?.remove();
  for (const run of directWordElements(paragraph, "r")) {
    directWordElements(run, "rPr")[0]?.getElementsByTagNameNS(WORD_NS, "b")[0]?.remove();
  }
}

function setSignatureColumn(paragraph: Element, side: "left" | "right") {
  let properties = directWordElements(paragraph, "pPr")[0];
  if (!properties) {
    properties = paragraph.ownerDocument.createElementNS(WORD_NS, "w:pPr");
    paragraph.insertBefore(properties, paragraph.firstChild);
  }
  let indent = directWordElements(properties, "ind")[0];
  if (!indent) {
    indent = paragraph.ownerDocument.createElementNS(WORD_NS, "w:ind");
    properties.append(indent);
  }
  indent.removeAttributeNS(WORD_NS, side === "left" ? "left" : "right");
  indent.setAttributeNS(WORD_NS, `w:${side === "left" ? "right" : "left"}`, "7200");
  setAlignment(paragraph, "center");
}

function removeBullet(paragraph: Element) {
  const properties = directWordElements(paragraph, "pPr")[0];
  directWordElements(properties ?? paragraph, "numPr")[0]?.remove();
}

function cloneParagraph(
  source: Element,
  text: string,
  alignment?: "center" | "both",
  bold = false,
) {
  const paragraph = source.cloneNode(true) as Element;
  setParagraphText(paragraph, text);
  if (alignment) setAlignment(paragraph, alignment);
  if (bold) setBold(paragraph);
  return paragraph;
}

function replaceCellContent(cell: Element, paragraphs: Element[]) {
  for (const paragraph of directWordElements(cell, "p")) paragraph.remove();
  for (const paragraph of paragraphs) cell.append(paragraph);
}

function weekendOrHolidayLabel(date: string, holidays: Holiday[]) {
  const parts: string[] = [];
  if (isWeekend(date)) parts.push(dayName(date).toUpperCase());
  const holiday = holidays.find((item) => item.date === date);
  if (holiday) parts.push(holiday.name.toUpperCase());
  return parts.join(" - ");
}

function replaceFooterSignature(footerXml: string, employee: Employee) {
  const footer = new DOMParser().parseFromString(footerXml, "application/xml");
  if (footer.querySelector("parsererror")) return footerXml;

  const paragraphs = wordElements(footer.documentElement, "p");
  const replaceAfter = (marker: string, name: string, position: string, side: "left" | "right") => {
    const markerIndex = paragraphs.findIndex((paragraph) =>
      paragraphText(paragraph).includes(marker),
    );
    if (markerIndex < 0) return;
    const [nameParagraph, positionParagraph] = paragraphs
      .slice(markerIndex + 1)
      .filter((paragraph) => paragraphText(paragraph).trim())
      .slice(0, 2);
    if (nameParagraph) setParagraphText(nameParagraph, name);
    if (positionParagraph) {
      setParagraphText(positionParagraph, position);
      setNotBold(positionParagraph);
    }
    if (nameParagraph) setSignatureColumn(nameParagraph, side);
    if (positionParagraph) setSignatureColumn(positionParagraph, side);
  };

  replaceAfter("Prepared by:", employee.fullName.toUpperCase(), employee.position, "left");
  replaceAfter("Noted by:", employee.notedByName, employee.notedByPosition, "right");
  return new XMLSerializer().serializeToString(footer);
}

/** Builds the report from the supplied Word template, preserving its original format. */
export async function buildWordDocument({
  report,
  employee,
  office,
  holidays,
}: ExportArgs): Promise<Blob> {
  const response = await fetch("/blank-accomplishment-report.docx");
  if (!response.ok) throw new Error("The Word template could not be loaded.");

  const zip = await JSZip.loadAsync(await response.arrayBuffer());
  const documentFile = zip.file("word/document.xml");
  if (!documentFile) throw new Error("The Word template is missing its document content.");

  const xml = await documentFile.async("string");
  const document = new DOMParser().parseFromString(xml, "application/xml");
  if (document.querySelector("parsererror"))
    throw new Error("The Word template could not be read.");

  const body = document.getElementsByTagNameNS(WORD_NS, "body")[0];
  const table = body ? wordElements(body, "tbl")[0] : undefined;
  if (!body || !table) throw new Error("The Word template table could not be found.");

  const titleParagraphs = directWordElements(body, "p");
  if (titleParagraphs[3])
    setParagraphText(titleParagraphs[3], office?.name || "Office of the Mayor");
  if (titleParagraphs[4]) setParagraphText(titleParagraphs[4], "Accomplishment Report");
  if (titleParagraphs[5])
    setParagraphText(
      titleParagraphs[5],
      `As of ${formatPeriod(report.periodStart, report.periodEnd)}`,
    );

  const templateRows = directWordElements(table, "tr");
  const headerRow = templateRows[0];
  const weekdayRow = templateRows.find((row) =>
    paragraphText(row).includes("<accomplishment sample"),
  );
  const weekendRow = templateRows.find((row) => /SATURDAY|SUNDAY/.test(paragraphText(row)));
  if (!headerRow || !weekdayRow || !weekendRow)
    throw new Error("The Word template row styles could not be found.");

  const weekdayCells = directWordElements(weekdayRow, "tc");
  const weekendCells = directWordElements(weekendRow, "tc");
  const weekdayDescription = directWordElements(weekdayCells[1]!, "p")[0];
  const weekendDescription = directWordElements(weekendCells[1]!, "p")[0];
  if (!weekdayDescription || !weekendDescription)
    throw new Error("The Word template cells could not be read.");

  for (const row of templateRows.slice(1)) row.remove();
  for (const entry of report.entries) {
    const row = (isWeekend(entry.date) ? weekendRow : weekdayRow).cloneNode(true) as Element;
    const cells = directWordElements(row, "tc");
    const dateParagraph = directWordElements(cells[0]!, "p")[0];
    if (!dateParagraph || !cells[1]) continue;
    setParagraphText(dateParagraph, formatLongDate(entry.date));
    setAlignment(dateParagraph, "center");

    const note = entry.label ?? weekendOrHolidayLabel(entry.date, holidays);
    const description: Element[] = [];
    if (note) {
      const noteParagraph = cloneParagraph(weekendDescription, note, "center", true);
      removeBullet(noteParagraph);
      description.push(noteParagraph);
    }
    for (const item of entry.items.filter((value) => value.trim())) {
      const itemParagraph = cloneParagraph(
        weekdayDescription,
        item,
        isWeekend(entry.date) ? "center" : "both",
      );
      if (isWeekend(entry.date)) removeBullet(itemParagraph);
      description.push(itemParagraph);
    }
    if (!description.length) description.push(cloneParagraph(weekdayDescription, "", "both"));
    replaceCellContent(cells[1], description);
    table.append(row);
  }

  zip.file("word/document.xml", new XMLSerializer().serializeToString(document));
  for (const fileName of Object.keys(zip.files).filter((name) =>
    /^word\/footer\d+\.xml$/.test(name),
  )) {
    const footerFile = zip.file(fileName);
    if (!footerFile) continue;
    zip.file(fileName, replaceFooterSignature(await footerFile.async("string"), employee));
  }
  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
  return blob;
}

/** Downloads the generated DOCX. */
export async function downloadWord(args: ExportArgs) {
  const blob = await buildWordDocument(args);
  const { employee, report } = args;
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = `${employee.fullName.replace(/[<>:"/\\|?*]+/g, " ").trim()} - Accomplishment Report - ${report.periodStart} to ${report.periodEnd}.docx`;
  window.document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
