$(document).ready(function () {
    var balance = 1000;
    var streak = 0;
    var isRolling = false;

    // Mapping dot positions by percentage [top, left]
    const dotMap = {
        1: [[50, 50]],
        2: [[25, 25], [75, 75]],
        3: [[25, 25], [50, 50], [75, 75]],
        4: [[25, 25], [75, 75], [25, 75], [75, 25]],
        5: [[25, 25], [75, 75], [25, 75], [75, 25], [50, 50]],
        6: [[25, 25], [75, 75], [25, 75], [75, 25], [50, 25], [50, 75]]
    };

    // Initialize the die with a '1'
    drawFace(1, "#die");

    function makeDot(top, left, elementID) {
        $("<div>")
            .css({
                "height": "15%",
                "width": "15%",
                "background-color": "white",
                "border-radius": "50%",
                "position": "absolute",
                "top": top + "%",
                "left": left + "%",
                "transform": "translate(-50%, -50%)",
                "box-shadow": "inset -2px -2px 2px rgba(0,0,0,0.3)"
            })
            .appendTo(elementID);
    }

    function drawFace(num, dieID) {
        $(dieID).empty();
        dotMap[num].forEach(pos => makeDot(pos[0], pos[1], dieID));
    }

    function rollDie(dieID, callback) {
        isRolling = true;
        $(dieID).addClass("shake");
        
        let rolls = 0;
        let interval = setInterval(() => {
            let tempNum = Math.ceil(Math.random() * 6);
            drawFace(tempNum, dieID);
            rolls++;
            
            if (rolls > 12) {
                clearInterval(interval);
                $(dieID).removeClass("shake");
                let finalNum = Math.ceil(Math.random() * 6);
                drawFace(finalNum, dieID);
                isRolling = false;
                callback(finalNum);
            }
        }, 60);
    }
   // Universal Chip Logic (Handles both Add and Subtract)
$(".chip.add, .chip.sub").on("click", function() {
    let $input = $("#riskInput");
    let current = parseInt($input.val()) || 100; // Fallback to 100 if empty
    let amount = parseInt($(this).data("amount"));
    let isAddition = $(this).hasClass("add");
    
    let newVal;
    if (isAddition) {
        newVal = current + amount;
    } else {
        newVal = current - amount;
    }

    // Constraints: 
    // 1. Don't go below $100
    // 2. Don't go above current balance
    if (newVal < 100) newVal = 100;
    if (newVal > balance) newVal = balance;

    $input.val(newVal);
});

// Clear Bet Logic
$("#clearBet").on("click", function() {
    $("#riskInput").val(0);
});
// Double Bet
$("#doubleBet").on("click", function() {
    let current = parseInt($("#riskInput").val()) || 0;
    $("#riskInput").val(Math.min(current * 2, balance));
});

// Half Bet
$("#halfBet").on("click", function() {
    let current = parseInt($("#riskInput").val()) || 0;
    $("#riskInput").val(Math.max(Math.floor(current / 2), 100));
});

// Max Bet
$("#maxBet").on("click", function() {
    $("#riskInput").val(balance);
});

    $("#rollBtn").on("click", function () {
        if (isRolling) return;

        var userGuess = $("#guessInput").val(); 
        var riskAmount = parseInt($("#riskInput").val());
        var message = $("#message");
        var minBet = 100;

        if (!userGuess || isNaN(riskAmount) || riskAmount < minBet) {
            message.text("⚠️ Select a guess and bet at least $" + minBet).css("color", "orange");
            return;
        }
        if (riskAmount > balance) {
            message.text("❌ Not enough credits!").css("color", "#ff4d4d");
            return;
        }

        balance -= riskAmount;
        $("#balance-display").text("$" + balance);
        message.text("Rolling...").css("color", "white");

        rollDie("#die", function (result) {
            let won = false;
            let multiplier = 2; // Default for High/Low

            if (userGuess === "high" && result >= 4) won = true;
            else if (userGuess === "low" && result <= 3) won = true;
            else if (parseInt(userGuess) === result) {
                won = true;
                multiplier = 5; // Higher payout for specific numbers
            }

            if (won) {
                streak++;
                if (streak >= 3) multiplier += 1; // Streak bonus
                let winnings = riskAmount * multiplier;
                balance += winnings;
                
                let winText = (streak >= 3) ? `🔥 STREAK x${streak}! ` : "🎉 WINNER! ";
                message.text(winText + "You won $" + winnings).css("color", "#4CAF50");
            } else {
                streak = 0;
                message.text("💀 Result: " + result + ". You lost $" + riskAmount).css("color", "#ff4d4d");
            }

            $("#balance-display").text("$" + balance);
            if (balance < 100) $("#game-over-overlay").fadeIn(500);
        });
    });

    $("#game-over-overlay").on("click", function() {
        balance = 1000;
        streak = 0;
        $("#balance-display").text("$" + balance);
        $(this).fadeOut(300);
        $("#message").text("New game started!").css("color", "white");
    });
});
