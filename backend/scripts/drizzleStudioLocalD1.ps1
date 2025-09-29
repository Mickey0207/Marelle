Param(
  [string]$DefaultGlob = ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite",
  [int]$TimeoutSeconds = 30
)

function Get-LatestSqlite {
  param([string]$Glob)
  $files = Get-ChildItem -Path $Glob -File -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
  if ($files -and $files.Count -gt 0) { return $files[0].FullName }
  return $null
}

$elapsed = 0
$db = Get-LatestSqlite -Glob $DefaultGlob
while (-not $db -and $elapsed -lt $TimeoutSeconds) {
  Write-Host "[等待] 正在等待本機 D1 資料庫建立中（wrangler 啟動後才會產生）... $elapsed/$TimeoutSeconds 秒"
  Start-Sleep -Seconds 1
  $elapsed += 1
  $db = Get-LatestSqlite -Glob $DefaultGlob
}

if (-not $db) {
  Write-Host "[!] 逾時：找不到本機 D1 SQLite 檔案: $DefaultGlob"
  Write-Host "    請確認 wrangler dev 正在執行，或手動指定路徑："
  Write-Host "    $env:DRIZZLE_SQLITE_PATH = '完整檔案路徑'; npx drizzle-kit studio"
  exit 1
}

Write-Host "[*] 使用本機 D1 SQLite：$db"
$env:DRIZZLE_SQLITE_PATH = $db
npx drizzle-kit studio