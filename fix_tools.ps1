# Fix all HTML files in tools/ directory
# Fixes: unicode mojibake, nav, footer, conflicting styles, favicon

$standardNav = @"
    <nav class="navbar" role="navigation">
        <div class="nav-container">
            <a href="/" class="logo">Factictionary</a>
            <ul class="nav-links">
                <li><a href="/blog/" class="nav-link">Articles</a></li>
                <li><a href="/glossary/" class="nav-link">Glossary</a></li>
                <li><a href="/tools/" class="nav-link active">Tools</a></li>
                <li><a href="/about.html" class="nav-link">About</a></li>
                <li><a href="/contact.html" class="nav-link">Contact</a></li>
            </ul>
        </div>
    </nav>
"@

$standardFooter = @"
    <footer class="footer">
        <div class="container text-center">
            <p>&copy; 2026 Factictionary. Your Ultimate Guide to Tech, Wealth, and Modern Living.</p>
        </div>
    </footer>
"@

$files = Get-ChildItem -Path "tools" -Filter "*.html" -Recurse | Where-Object { $_.Name -ne "index.html.bak" }

$fixedCount = 0
$unchangedCount = 0

foreach ($file in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $content = [System.Text.Encoding]::UTF8.GetString($bytes)
    $original = $content

    # === UNICODE FIXES ===
    # Use char arrays to avoid PowerShell string parsing issues with special chars
    # We'll use byte-level replacements via encoding

    # Re-read as Latin-1 to get the raw bytes as characters, then do string replacements
    $latin1 = [System.Text.Encoding]::GetEncoding(28591)
    $contentLatin = $latin1.GetString($bytes)

    # Define replacements as [corrupted-latin1, correct-utf8] pairs
    $replacements = @(
        @([char[]]@(0xC3,0xA2,0xCB,0x86,0xC2,0xB0) | ForEach-Object {[char]$_} | Join-String, [char]0x2630),  # â˜° -> ☰
        @([char[]]@(0xC3,0xA2,0xC2,0xAC,0xC2,0x9E) | ForEach-Object {[char]$_} | Join-String, [char]0x2714),  # âœ" -> ✔
        @([char[]]@(0xC3,0xA2,0xC2,0xAC,0xC2,0x85) | ForEach-Object {[char]$_} | Join-String, [char]0x2705),  # âœ… -> ✅
        @([char[]]@(0xC3,0xA2,0xC2,0x80,0xC2,0x9C) | ForEach-Object {[char]$_} | Join-String, [char]0x201C),  # â€œ -> "
        @([char[]]@(0xC3,0xA2,0xC2,0x80,0xC2,0x9D) | ForEach-Object {[char]$_} | Join-String, [char]0x201D),  # â€ -> "
        @([char[]]@(0xC3,0xA2,0xC2,0x80,0xC2,0x98) | ForEach-Object {[char]$_} | Join-String, [char]0x2018),  # â€˜ -> '
        @([char[]]@(0xC3,0xA2,0xC2,0x80,0xC2,0x99) | ForEach-Object {[char]$_} | Join-String, [char]0x2019),  # â€™ -> '
        @([char[]]@(0xC3,0xA2,0xC2,0x80,0xC2,0x94) | ForEach-Object {[char]$_} | Join-String, [char]0x2014),  # â€" -> —
        @([char[]]@(0xC3,0xA2,0xC2,0x80,0xC2,0xA2) | ForEach-Object {[char]$_} | Join-String, [char]0x2022),  # â€¢ -> •
        @([char[]]@(0xC3,0x83,0xC2,0x97) | ForEach-Object {[char]$_} | Join-String, [char]0x00D7),            # Ã— -> ×
        @([char[]]@(0xC3,0x82,0xC2,0xB0) | ForEach-Object {[char]$_} | Join-String, [char]0x00B0),            # Â° -> °
        @([char[]]@(0xC3,0x82,0xC2,0xBD) | ForEach-Object {[char]$_} | Join-String, [char]0x00BD),            # Â½ -> ½
        @([char[]]@(0xC3,0x82,0xC2,0xB7) | ForEach-Object {[char]$_} | Join-String, [char]0x00B7),            # Â· -> ·
        @([char[]]@(0xC3,0x82,0xC2,0xBB) | ForEach-Object {[char]$_} | Join-String, [char]0x00BB),            # Â» -> »
        @([char[]]@(0xC3,0x82,0xC2,0xAB) | ForEach-Object {[char]$_} | Join-String, [char]0x00AB),            # Â« -> «
        @([char[]]@(0xC3,0xA2,0xC2,0x89,0xC2,0xA1) | ForEach-Object {[char]$_} | Join-String, [char]0x2261),  # â‰¡ -> ≡
        @([char[]]@(0xC3,0xA2,0xC2,0x9A,0xC2,0xA1) | ForEach-Object {[char]$_} | Join-String, [char]0x26A1),  # âš¡ -> ⚡
        @([char[]]@(0xC3,0xA2,0xC2,0xAC,0xC2,0x8C) | ForEach-Object {[char]$_} | Join-String, [char]0x274C),  # âŒ -> ❌
        @([char[]]@(0xC3,0xA2,0xC2,0xAC,0xC2,0xA8) | ForEach-Object {[char]$_} | Join-String, [char]0x2728),  # âœ¨ -> ✨
        @([char[]]@(0xC3,0xA2,0xC2,0xAC,0xC2,0x82) | ForEach-Object {[char]$_} | Join-String, [char]0x2702),  # âœ‚ -> ✂
        @([char[]]@(0xC3,0xA2,0xC2,0xAD,0xC2,0xB3) | ForEach-Object {[char]$_} | Join-String, [char]0x23F3),  # â³ -> ⏳
        @([char[]]@(0xC3,0xA2,0xC2,0xAC,0xC2,0x82,0xC3,0xAF,0xC2,0xB8,0xC2,0x8F) | ForEach-Object {[char]$_} | Join-String, "✂️"),  # âœ‚ï¸ -> ✂️
        @([char[]]@(0xC3,0xA2,0xC2,0xAC,0xC2,0x85,0xC3,0xAF,0xC2,0xB8,0xC2,0x8F) | ForEach-Object {[char]$_} | Join-String, "✅"),  # âœ…ï¸ variant
        @([char[]]@(0xC3,0xA2,0xC2,0xAD,0xC2,0xB1,0xC3,0xAF,0xC2,0xB8,0xC2,0x8F) | ForEach-Object {[char]$_} | Join-String, "⏱️"),  # â±ï¸ -> ⏱️
        @([char[]]@(0xC3,0xA2,0xC2,0xAC,0xC2,0x87,0xC3,0xAF,0xC2,0xB8,0xC2,0x8F) | ForEach-Object {[char]$_} | Join-String, "⬇️"),  # â¬‡ï¸ -> ⬇️
        @([char[]]@(0xC3,0xA2,0xC2,0xAC,0xC2,0x86,0xC3,0xAF,0xC2,0xB8,0xC2,0x8F) | ForEach-Object {[char]$_} | Join-String, "⬆️"),  # â¬†ï¸ -> ⬆️
        @([char[]]@(0xC3,0xA2,0xC2,0xAE,0xC2,0xAF,0xC3,0xAF,0xC2,0xB8,0xC2,0x8F) | ForEach-Object {[char]$_} | Join-String, "⏮️"),  # â®ï¸ -> ⏮️
        @([char[]]@(0xC3,0xA2,0xC2,0xAD,0xC2,0xAD,0xC3,0xAF,0xC2,0xB8,0xC2,0x8F) | ForEach-Object {[char]$_} | Join-String, "⏭️"),  # â­ï¸ -> ⏭️
        @([char[]]@(0xC3,0xA2,0xC2,0x96,0xC2,0xB6,0xC3,0xAF,0xC2,0xB8,0xC2,0x8F) | ForEach-Object {[char]$_} | Join-String, "▶️"),  # â–¶ï¸ -> ▶️
        @([char[]]@(0xC3,0xA2,0xC2,0xB8,0xC3,0xAF,0xC2,0xB8,0xC2,0x8F) | ForEach-Object {[char]$_} | Join-String, "⏸️"),  # â¸ï¸ -> ⏸️
        @([char[]]@(0xC3,0xA2,0xC2,0x80,0xC2,0x93) | ForEach-Object {[char]$_} | Join-String, [char]0x2013)   # â€" (en dash variant)
    )

    foreach ($pair in $replacements) {
        $contentLatin = $contentLatin.Replace($pair[0], $pair[1])
    }

    # Convert back to UTF-8 bytes then to string
    $fixedBytes = $latin1.GetBytes($contentLatin)
    $content = [System.Text.Encoding]::UTF8.GetString($fixedBytes)

    # === FIX NAV ===
    $content = [regex]::Replace($content, '(?s)<nav[^>]*class="navbar"[^>]*>.*?</nav>', $standardNav)

    # === FIX FOOTER ===
    $content = [regex]::Replace($content, '(?s)<footer[^>]*>.*?</footer>', $standardFooter)

    # === REMOVE CONFLICTING BOTTOM STYLE BLOCKS ===
    $content = [regex]::Replace($content, '(?s)\n\s*<style>\s*(?:[^<]|<(?!/style>))*(?:body\s*\{|\.navbar\s*\{|\.nav-container\s*\{|\.logo\s*\{|\.nav-links\s*\{|\.btn\s*\{|\.footer\s*\{|\.container\s*\{)(?:[^<]|<(?!/style>))*</style>', '')

    # === ADD FAVICON IF MISSING ===
    if ($content -notmatch 'rel="icon"') {
        $content = $content -replace '(<link rel="stylesheet" href="/assets/css/style\.css">)', "<link rel=`"icon`" type=`"image/x-icon`" href=`"/favicon.ico`">`n    `$1"
    }

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, (New-Object System.Text.UTF8Encoding $false))
        Write-Host "FIXED: $($file.Name)"
        $fixedCount++
    } else {
        Write-Host "UNCHANGED: $($file.Name)"
        $unchangedCount++
    }
}
Write-Host ""
Write-Host "Summary: $fixedCount fixed, $unchangedCount unchanged"
