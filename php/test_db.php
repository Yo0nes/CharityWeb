<?php
require_once 'config.php';
if ($conn) {
    echo "Database connection successful!";
} else {
    echo "Connection failed!";
}
?>