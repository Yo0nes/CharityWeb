<?php
session_start();
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $amount = filter_input(INPUT_POST, 'amount', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $phone = filter_input(INPUT_POST, 'phone_number', FILTER_SANITIZE_STRING);
    
    // Only store last 4 digits of card number for security
    $card_number = isset($_POST['card_number']) ? substr($_POST['card_number'], -4) : '';
    
    // Get user_id if logged in
    $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    
    $stmt = $conn->prepare("INSERT INTO donations (user_id, amount, email, phone_number, card_number) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("idsss", $user_id, $amount, $email, $phone, $card_number);
    
    if ($stmt->execute()) {
        $_SESSION['donation_success'] = true;
        header("Location: ../donation_success.html");
        exit();
    } else {
        $_SESSION['error'] = "Error processing donation. Please try again.";
        header("Location: ../Donation.html");
        exit();
    }
} else {
    header("Location: ../Donation.html");
    exit();
}