Option Explicit

' Starts the application without showing a Command Prompt window.
' Safe to use as the "Program/script" target in Windows Task Scheduler.
Dim shell, fileSystem, appFolder, startScript, command

Set shell = CreateObject("WScript.Shell")
Set fileSystem = CreateObject("Scripting.FileSystemObject")

appFolder = fileSystem.GetParentFolderName(WScript.ScriptFullName)
startScript = appFolder & "\start.bat"
command = shell.ExpandEnvironmentStrings("%ComSpec%") & " /c " & _
    Chr(34) & Chr(34) & startScript & Chr(34) & " __run" & Chr(34)

' 0 = hidden window; False = do not wait for the long-running server process.
shell.Run command, 0, False
