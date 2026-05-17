# 《微光文明》字數統計腳本
# 自動掃描所有正文章節，統計中文字數，輸出進度儀表板數據
# 用法：在專案根目錄執行 powershell -File scripts/count-words.ps1

param(
    [string]$ContentPath = "01_NOVEL_CONTENT",
    [switch]$Detailed
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$contentDir = Join-Path $projectRoot $ContentPath

if (-not (Test-Path $contentDir)) {
    Write-Error "找不到正文目錄: $contentDir"
    exit 1
}

# 中文字元正規表達式（CJK Unified Ideographs 基本區 + 擴展A）
$cjkPattern = '[\u4e00-\u9fff\u3400-\u4dbf]'

$volumes = Get-ChildItem -Path $contentDir -Directory | Sort-Object Name
$totalChapters = 0
$totalWords = 0
$belowStandard = @()

Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  《微光文明》字數統計報告" -ForegroundColor Cyan
Write-Host "  統計日期：$(Get-Date -Format 'yyyy-MM-dd')" -ForegroundColor Gray
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

foreach ($vol in $volumes) {
    $chapters = Get-ChildItem -Path $vol.FullName -Filter "*.md" | Sort-Object Name
    $volWords = 0
    $volChapters = 0
    $volMin = [int]::MaxValue
    $volMax = 0
    $volMinName = ""
    $volMaxName = ""
    
    Write-Host "📖 $($vol.Name)" -ForegroundColor Yellow
    Write-Host "─────────────────────────────────────────────────"
    
    foreach ($ch in $chapters) {
        $content = Get-Content -Path $ch.FullName -Raw -Encoding UTF8
        $matches = [regex]::Matches($content, $cjkPattern)
        $wordCount = $matches.Count
        
        $volWords += $wordCount
        $volChapters++
        
        $chName = [System.IO.Path]::GetFileNameWithoutExtension($ch.Name)
        
        if ($wordCount -lt $volMin) { $volMin = $wordCount; $volMinName = $chName }
        if ($wordCount -gt $volMax) { $volMax = $wordCount; $volMaxName = $chName }
        
        $status = if ($wordCount -ge 3000) { "✅" } else { "❌"; $belowStandard += "$chName ($wordCount)" }
        
        if ($Detailed) {
            $bar = "█" * [math]::Min([math]::Floor($wordCount / 200), 30)
            Write-Host ("  {0,-30} {1,5} 字 {2} {3}" -f $chName, $wordCount, $status, $bar)
        }
    }
    
    $volAvg = if ($volChapters -gt 0) { [math]::Round($volWords / $volChapters) } else { 0 }
    $volPass = ($chapters | Where-Object {
        $c = Get-Content -Path $_.FullName -Raw -Encoding UTF8
        ([regex]::Matches($c, $cjkPattern)).Count -ge 3000
    }).Count
    $volRate = if ($volChapters -gt 0) { [math]::Round($volPass / $volChapters * 100, 1) } else { 0 }
    
    Write-Host ""
    Write-Host "  章數: $volChapters | 總字數: $($volWords.ToString('N0')) | 平均: $volAvg | 達標率: $volRate%"
    Write-Host "  最長: $volMaxName ($volMax) | 最短: $volMinName ($volMin)"
    Write-Host ""
    
    $totalChapters += $volChapters
    $totalWords += $volWords
}

Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  全書統計" -ForegroundColor Cyan
Write-Host "─────────────────────────────────────────────────"
Write-Host "  總章數: $totalChapters"
Write-Host "  總字數: $($totalWords.ToString('N0'))"
Write-Host "  平均字數: $([math]::Round($totalWords / [math]::Max($totalChapters, 1)))"
Write-Host "  達標率: $([math]::Round(($totalChapters - $belowStandard.Count) / [math]::Max($totalChapters, 1) * 100, 1))%"
Write-Host ""

if ($belowStandard.Count -gt 0) {
    Write-Host "⚠️ 未達標章節 ($($belowStandard.Count) 章):" -ForegroundColor Red
    foreach ($bs in $belowStandard) {
        Write-Host "  - $bs" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
