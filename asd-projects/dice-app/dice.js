$(document).ready(function () {
    // --- State Variables ---
    var balance = 1000; // Starting money
    var streak = 0;    // Tracks consecutive wins for the bonus multiplier
    var isRolling = false; // Prevents spamming the roll button while dice are moving

    // --- Visual Configuration ---
    // Coordinates for the dots (pips) on a die face (in percentages)
    const dotMap = {
        1: [[50, 50]],
        2: [[25, 25], [75, 75]],
        3: [[25, 25], [50, 50], [75, 75]],
        4: [[25, 25], [75, 75], [25, 75], [75, 25]],
        5: [[25, 25], [75, 75], [25, 75], [75, 25], [50, 50]],
        6: [[25, 25], [75, 75], [25, 75], [75, 25], [50, 25], [50, 75]]
    };

    // Initialize the visual dice faces on page load
    drawFace(1, "#die1");
    drawFace(6, "#die2");

    // --- Rendering Functions ---
    
    // Creates a single white dot at a specific X/Y position inside a die
    function makeDot(top, left, elementID) {
        $("<div>").css({
            "height": "15%", "width": "15%", "background-color": "white",
            "border-radius": "50%", "position": "absolute", "top": top + "%",
            "left": left + "%", "transform": "translate(-50%, -50%)",
            "box-shadow": "inset -2px -2px 2px rgba(0,0,0,0.3)"
        }).appendTo(elementID);
    }

    // Clears the current die and draws the correct number of dots based on the dotMap
    function drawFace(num, dieID) {
        $(dieID).empty();
        dotMap[num].forEach(pos => makeDot(pos[0], pos[1], dieID));
    }

    // --- Animation Logic ---
    
    function rollDice(callback) {
        isRolling = true;
        $(".die").addClass("shake"); // Starts the CSS shake animation
        
        let rolls = 0;
        // Changes the numbers rapidly to create a "blur" rolling effect
        let interval = setInterval(() => {
            drawFace(Math.ceil(Math.random() * 6), "#die1");
            drawFace(Math.ceil(Math.random() * 6), "#die2");
            rolls++;
            
            // After 15 frames, stop the animation and determine the final result
            if (rolls > 15) {
                clearInterval(interval);
                $(".die").removeClass("shake");
                
                let res1 = Math.ceil(Math.random() * 6);
                let res2 = Math.ceil(Math.random() * 6);
                
                drawFace(res1, "#die1");
                drawFace(res2, "#die2");
                
                isRolling = false;
                callback(res1 + res2); // Send the total back to the main logic
            }
        }, 50);
    }

    // --- Betting Controls (Input Helpers) ---

    // Handles "Chip" clicks (+10, +50, -100, etc.)
    $(".chip.add, .chip.sub").on("click", function() {
        let $input = $("#riskInput");
        let current = parseInt($input.val()) || 0;
        let amount = parseInt($(this).data("amount"));
        
        // Add or subtract depending on the button class
        let newVal = $(this).hasClass("add") ? current + amount : current - amount;
        
        // Ensure the bet is between $100 and the user's current balance
        $input.val(Math.min(Math.max(newVal, 100), balance));
    });

    // Quick math buttons (Clear, Max, Double, Half)
    $("#clearBet").on("click", () => $("#riskInput").val(0));
    $("#maxBet").on("click", () => $("#riskInput").val(balance));
    $("#doubleBet").on("click", () => $("#riskInput").val(Math.min(parseInt($("#riskInput").val()) * 2 || 200, balance)));
    $("#halfBet").on("click", () => $("#riskInput").val(Math.max(Math.floor(parseInt($("#riskInput").val()) / 2), 100)));

    // --- Main Game Logic ---

    $("#rollBtn").on("click", function () {
        if (isRolling) return; // Prevent clicking while dice are already moving

        var userGuess = $("#guessInput").val(); 
        var riskAmount = parseInt($("#riskInput").val());
        var message = $("#message");

        // Validation: Ensure valid bet and enough money
        if (!userGuess || isNaN(riskAmount) || riskAmount < 100) {
            message.text("⚠️ Select a bet (Min $100)").css("color", "orange");
            return;
        }
        if (riskAmount > balance) {
            message.text("❌ Not enough credits!").css("color", "#ff4d4d");
            return;
        }

        // Deduct money immediately upon rolling
        balance -= riskAmount;
        $("#balance-display").text("$" + balance);
        message.text("Rolling...").css("color", "white");

        // Trigger the animation and handle results in the callback
        rollDice(function (total) {
            let won = false;
            let multiplier = 0;

            // Check win conditions based on the 2-dice total
            if (userGuess === "low" && total <= 6) { won = true; multiplier = 2; }
            else if (userGuess === "high" && total >= 8) { won = true; multiplier = 2; }
            else if (userGuess === "seven" && total === 7) { won = true; multiplier = 5; }
            else if (userGuess === "snake" && total === 2) { won = true; multiplier = 12; } // Snake eyes
            else if (userGuess === "boxcars" && total === 12) { won = true; multiplier = 12; } // Double sixes

            if (won) {
                streak++;
                // Bonus: If you win 3+ times in a row, payouts increase by 1x
                if (streak >= 3) multiplier += 1; 
                
                let winnings = riskAmount * multiplier;
                balance += winnings;
                message.text((streak >= 3 ? "🔥 STREAK! " : "🎉 ") + "Total: " + total + ". Won $" + winnings).css("color", "#4CAF50");
            } else {
                streak = 0; // Reset streak on loss
                message.text("💀 Total: " + total + ". You lost $" + riskAmount).css("color", "#ff4d4d");
            }

            // Update display and check for Game Over
            $("#balance-display").text("$" + balance);
            if (balance < 100) $("#game-over-overlay").fadeIn(500);
        });
    });

    // Reset the game when clicking the "Game Over" screen
    $("#game-over-overlay").on("click", function() {
        balance = 1000;
        $("#balance-display").text("$" + balance);
        $(this).fadeOut(300);
    });
});