$(document).ready(function () {
    var balance = 1000;
    var streak = 0;
    var isRolling = false;

    const dotMap = {
        1: [[50, 50]],
        2: [[25, 25], [75, 75]],
        3: [[25, 25], [50, 50], [75, 75]],
        4: [[25, 25], [75, 75], [25, 75], [75, 25]],
        5: [[25, 25], [75, 75], [25, 75], [75, 25], [50, 50]],
        6: [[25, 25], [75, 75], [25, 75], [75, 25], [50, 25], [50, 75]]
    };

    // Initialize both dice
    drawFace(1, "#die1");
    drawFace(6, "#die2");

    function makeDot(top, left, elementID) {
        $("<div>").css({
            "height": "15%", "width": "15%", "background-color": "white",
            "border-radius": "50%", "position": "absolute", "top": top + "%",
            "left": left + "%", "transform": "translate(-50%, -50%)",
            "box-shadow": "inset -2px -2px 2px rgba(0,0,0,0.3)"
        }).appendTo(elementID);
    }

    function drawFace(num, dieID) {
        $(dieID).empty();
        dotMap[num].forEach(pos => makeDot(pos[0], pos[1], dieID));
    }

    function rollDice(callback) {
        isRolling = true;
        $(".die").addClass("shake");
        
        let rolls = 0;
        let interval = setInterval(() => {
            drawFace(Math.ceil(Math.random() * 6), "#die1");
            drawFace(Math.ceil(Math.random() * 6), "#die2");
            rolls++;
            
            if (rolls > 15) {
                clearInterval(interval);
                $(".die").removeClass("shake");
                let res1 = Math.ceil(Math.random() * 6);
                let res2 = Math.ceil(Math.random() * 6);
                drawFace(res1, "#die1");
                drawFace(res2, "#die2");
                isRolling = false;
                callback(res1 + res2);
            }
        }, 50);
    }

    // Betting Controls (Add/Sub/Math)
    $(".chip.add, .chip.sub").on("click", function() {
        let $input = $("#riskInput");
        let current = parseInt($input.val()) || 0;
        let amount = parseInt($(this).data("amount"));
        let newVal = $(this).hasClass("add") ? current + amount : current - amount;
        $input.val(Math.min(Math.max(newVal, 100), balance));
    });

    $("#clearBet").on("click", () => $("#riskInput").val(0));
    $("#maxBet").on("click", () => $("#riskInput").val(balance));
    $("#doubleBet").on("click", () => $("#riskInput").val(Math.min(parseInt($("#riskInput").val()) * 2 || 200, balance)));
    $("#halfBet").on("click", () => $("#riskInput").val(Math.max(Math.floor(parseInt($("#riskInput").val()) / 2), 100)));

    $("#rollBtn").on("click", function () {
        if (isRolling) return;

        var userGuess = $("#guessInput").val(); 
        var riskAmount = parseInt($("#riskInput").val());
        var message = $("#message");

        if (!userGuess || isNaN(riskAmount) || riskAmount < 100) {
            message.text("⚠️ Select a bet (Min $100)").css("color", "orange");
            return;
        }
        if (riskAmount > balance) {
            message.text("❌ Not enough credits!").css("color", "#ff4d4d");
            return;
        }

        balance -= riskAmount;
        $("#balance-display").text("$" + balance);
        message.text("Rolling...").css("color", "white");

        rollDice(function (total) {
            let won = false;
            let multiplier = 0;

            // Updated Betting Logic for 2 Dice
            if (userGuess === "low" && total <= 6) { won = true; multiplier = 2; }
            else if (userGuess === "high" && total >= 8) { won = true; multiplier = 2; }
            else if (userGuess === "seven" && total === 7) { won = true; multiplier = 5; }
            else if (userGuess === "snake" && total === 2) { won = true; multiplier = 12; }
            else if (userGuess === "boxcars" && total === 12) { won = true; multiplier = 12; }

            if (won) {
                streak++;
                if (streak >= 3) multiplier += 1; 
                let winnings = riskAmount * multiplier;
                balance += winnings;
                message.text((streak >= 3 ? "🔥 STREAK! " : "🎉 ") + "Total: " + total + ". Won $" + winnings).css("color", "#4CAF50");
            } else {
                streak = 0;
                message.text("💀 Total: " + total + ". You lost $" + riskAmount).css("color", "#ff4d4d");
            }

            $("#balance-display").text("$" + balance);
            if (balance < 100) $("#game-over-overlay").fadeIn(500);
        });
    });

    $("#game-over-overlay").on("click", function() {
        balance = 1000;
        $("#balance-display").text("$" + balance);
        $(this).fadeOut(300);
    });
});