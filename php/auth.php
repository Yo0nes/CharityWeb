<?php
require_once 'config.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $action = $_POST['action'];

    if ($action == "register") {
        // Get form data
        $firstName = $_POST['first-name'];
        $lastName = $_POST['last-name'];
        $email = $_POST['email'];
        $password = $_POST['psword'];

        // Hash the password
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        // Prepare SQL statement
        $sql = "INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)";
        
        // Create prepared statement
        $stmt = mysqli_prepare($conn, $sql);
        
        if ($stmt) {
            // Bind parameters
            mysqli_stmt_bind_param($stmt, "ssss", $firstName, $lastName, $email, $passwordHash);
            
            // Execute the statement
            if (mysqli_stmt_execute($stmt)) {
                // Registration successful
                $_SESSION['registration_success'] = true;
                header("Location: ../Login.html");
                exit();
            } else {
                // Registration failed
                if (mysqli_errno($conn) == 1062) {
                    // Duplicate email error
                    echo "Email already exists. Please use a different email.";
                } else {
                    echo "Registration failed. Please try again.";
                }
            }
            mysqli_stmt_close($stmt);
        } else {
            echo "Error preparing statement: " . mysqli_error($conn);
        }
    }
    
    else if ($action == "login") {
        $email = $_POST['emailInput'];
        $password = $_POST['passwordInput'];
        
        $sql = "SELECT id, first_name, password_hash FROM users WHERE email = ?";
        $stmt = mysqli_prepare($conn, $sql);
        
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "s", $email);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            
            if ($user = mysqli_fetch_assoc($result)) {
                if (password_verify($password, $user['password_hash'])) {
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['first_name'] = $user['first_name'];                    header("Location: /charity-master/Save_Gaza.html");
                    exit();
                } else {
                    echo "Invalid password";
                }
            } else {
                echo "User not found";
            }
            mysqli_stmt_close($stmt);
        }
    }
}
?>
