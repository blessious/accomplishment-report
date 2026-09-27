@echo off
setlocal

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$appPath = (Resolve-Path -LiteralPath '%~dp0').Path.TrimEnd('\');" ^
    "$listeners = Get-NetTCPConnection -LocalPort 4199 -State Listen -ErrorAction SilentlyContinue;" ^
    "if (-not $listeners) { Write-Host 'No process is listening on port 4199.'; exit 0 }" ^
    "$stopped = $false;" ^
    "$skipped = $false;" ^
    "foreach ($listener in $listeners) {" ^
    "    $pidValue = $listener.OwningProcess;" ^
    "    $process = Get-CimInstance Win32_Process -Filter \"ProcessId = $pidValue\" -ErrorAction SilentlyContinue;" ^
    "    $commandLine = if ($process.CommandLine) { $process.CommandLine } else { '' };" ^
    "    if ($commandLine -like \"*$appPath*\") {" ^
    "        Write-Host \"Stopping this app on port 4199, process $pidValue...\";" ^
    "        Stop-Process -Id $pidValue -Force -ErrorAction SilentlyContinue;" ^
    "        $stopped = $true;" ^
    "    } else {" ^
    "        Write-Host \"Port 4199 is used by another process ($pidValue). Leaving it running.\";" ^
    "        $skipped = $true;" ^
    "    }" ^
    "}" ^
    "if (-not $stopped -and -not $skipped) { Write-Host 'No application process is listening on port 4199.' }"
