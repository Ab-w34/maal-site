<#
    Start-Maal.ps1
    Serves this folder over HTTP so the site runs at a real address
    instead of a file:// path. No Python, Node or install needed —
    this uses .NET, which ships with Windows.

    Usage (from the maal folder):
        .\Start-Maal.ps1                 ->  http://localhost:8000
        .\Start-Maal.ps1 -Hostname maal  ->  http://maal:8000   (needs admin + hosts entry, see README)
        .\Start-Maal.ps1 -Port 3000      ->  a different port

    Stop the server with Ctrl+C.
#>

param(
    [string]$Hostname = "localhost",
    [int]$Port = 8000
)

$root = $PSScriptRoot
$prefix = if ($Hostname -eq "localhost") { "http://localhost:$Port/" } else { "http://+:$Port/" }

$mime = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".json" = "application/json; charset=utf-8"
    ".woff2" = "font/woff2"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
}
catch {
    Write-Host ""
    Write-Host "Could not start the server on $prefix" -ForegroundColor Red
    if ($Hostname -ne "localhost") {
        Write-Host "Binding to a custom hostname needs an elevated PowerShell." -ForegroundColor Yellow
        Write-Host "Right-click PowerShell and choose 'Run as administrator', then try again." -ForegroundColor Yellow
    }
    else {
        Write-Host "Port $Port may already be in use. Try:  .\Start-Maal.ps1 -Port 8080" -ForegroundColor Yellow
    }
    exit 1
}

$url = "http://${Hostname}:$Port/"
Write-Host ""
Write-Host "  Maal is running at $url" -ForegroundColor Green
Write-Host "  Serving: $root"
Write-Host "  Press Ctrl+C to stop."
Write-Host ""
Start-Process $url

while ($listener.IsListening) {
    try {
        $context  = $listener.GetContext()
        $request  = $context.Request
        $response = $context.Response

        $path = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath)
        if ($path -eq "/") { $path = "/index.html" }

        $file = Join-Path $root ($path.TrimStart("/") -replace "/", "\")

        # keep requests inside the site folder
        $full = [System.IO.Path]::GetFullPath($file)
        if (-not $full.StartsWith([System.IO.Path]::GetFullPath($root))) {
            $response.StatusCode = 403
            $response.Close()
            continue
        }

        if (Test-Path $full -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($full)
            $ext = [System.IO.Path]::GetExtension($full).ToLower()
            $response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "  200  $path"
        }
        else {
            $body = [System.Text.Encoding]::UTF8.GetBytes("404 - not found: $path")
            $response.StatusCode = 404
            $response.ContentType = "text/plain; charset=utf-8"
            $response.OutputStream.Write($body, 0, $body.Length)
            Write-Host "  404  $path" -ForegroundColor DarkYellow
        }

        $response.Close()
    }
    catch {
        # client disconnected mid-request; keep serving
    }
}
