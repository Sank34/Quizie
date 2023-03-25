<?php
// Step 1: Send header for serving JSON
header('Content-Type: application/json');

// Step 2: Get the current directory
$dir = dirname(__FILE__);

// Step 3: Get all files in the directory
$files = scandir($dir);

// Step 4: Filter only JSON files
$jsonFiles = array_filter($files, function($file) {
    return pathinfo($file, PATHINFO_EXTENSION) === 'json';
});

// Step 5: Return the results as a JSON array without file extensions
$output = [];
foreach ($jsonFiles as $jsonFile) {
    $output[] = pathinfo($jsonFile, PATHINFO_FILENAME);
}
echo json_encode($output);
?>