# PowerShell script to properly add dark-mode.js script to all HTML files

# Get all HTML files in the website directory
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    # Read the file content
    $content = Get-Content $file.FullName -Raw
    
    # Determine relative path prefix based on file location
    $relativePath = ""
    if ($file.Directory.FullName -ne (Get-Location).Path) {
        # Calculate relative path based on directory depth
        $dirDepth = ($file.Directory.FullName.Split("\") | Where-Object { $_ -ne "" }).Count - ((Get-Location).Path.Split("\") | Where-Object { $_ -ne "" }).Count
        for ($i = 0; $i -lt $dirDepth; $i++) {
            $relativePath += "../"
        }
    }
    
    # Define the script tags
    $darkModeScriptTag = "<script src=`"${relativePath}assets/js/dark-mode.js`"></script>"
    
    # Remove any existing malformed dark mode script tags
    $content = $content -replace '<script src=".*?dark-mode\.js".*?>.*?</script>', ''
    
    # Check if the file already has a proper dark mode script reference
    if ($content -match "<script src=(`"|').*?dark-mode\.js(`"|')></script>") {
        Write-Host "Skipping $($file.Name) - already has proper dark-mode.js reference"
        continue
    }
    
    # Insert the dark mode script before the closing body tag
    $updatedContent = $content -replace "(\s*</body>)", "`n    $darkModeScriptTag`n$1"
    
    # Write the updated content back to the file
    Set-Content -Path $file.FullName -Value $updatedContent -NoNewline
    
    Write-Host "Updated $($file.Name) with dark mode script"
}

Write-Host "Completed updating all HTML files with dark mode script"
