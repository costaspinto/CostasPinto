$ErrorActionPreference = "Stop"

$target = "C:\Users\costa\Downloads\costas-ai-portfolio-functional\costas-ai-portfolio"
$expected = "costas-ai-portfolio"

Write-Host "`nWARNING: PORTFOLIO DELETION" -ForegroundColor Red
Write-Host "Target: $target" -ForegroundColor Yellow

if (!(Test-Path -LiteralPath $target -PathType Container)) {
    Write-Host "Folder not found. Cancelled." -ForegroundColor Red
    exit
}

if ((Split-Path -Leaf $target) -cne $expected) {
    Write-Host "Path verification failed. Cancelled." -ForegroundColor Red
    exit
}

if ((Resolve-Path -LiteralPath $target).Path -cne $target) {
    Write-Host "Resolved path mismatch. Cancelled." -ForegroundColor Red
    exit
}

if ((Read-Host "Confirmation 1/4: Type REVIEW") -cne "REVIEW") {
    Write-Host "Cancelled. Nothing deleted." -ForegroundColor Green
    exit
}

if ((Read-Host "Confirmation 2/4: Type costas-ai-portfolio") -cne $expected) {
    Write-Host "Cancelled. Nothing deleted." -ForegroundColor Green
    exit
}

if ((Read-Host "Confirmation 3/4: Type DELETE PORTFOLIO") -cne "DELETE PORTFOLIO") {
    Write-Host "Cancelled. Nothing deleted." -ForegroundColor Green
    exit
}

if ((Read-Host "FINAL confirmation 4/4: Type YES") -cne "YES") {
    Write-Host "Cancelled. Nothing deleted." -ForegroundColor Green
    exit
}

Remove-Item -LiteralPath $target -Recurse -Force -Confirm:$false
Write-Host "Portfolio folder deleted." -ForegroundColor Yellow
