# PowerShell script to add apply-dark-mode.js to the head section of all HTML files

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
    
    # Define the script tag
    $applyDarkModeTag = "<script src=`"${relativePath}assets/js/apply-dark-mode.js`"></script>"
    
    # Check if the file already has the apply-dark-mode.js reference
    if ($content -match "<script src=(`"|').*?apply-dark-mode\.js(`"|')></script>") {
        Write-Host "Skipping $($file.Name) - already has apply-dark-mode.js reference"
        continue
    }
    
    # Insert the script tag at the end of the head section
    $updatedContent = $content -replace "(\s*</head>)", "`n    $applyDarkModeTag`n$1"
    
    # Write the updated content back to the file
    Set-Content -Path $file.FullName -Value $updatedContent -NoNewline
    
    Write-Host "Updated $($file.Name) with apply-dark-mode.js in head"
}

Write-Host "Completed adding apply-dark-mode.js to all HTML files"
