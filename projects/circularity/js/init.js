let carState = {
    engine: false,
    battery: false
};

let isDrivingMode = false;

function installPart(part) {
    carState[part] = true;
    const slot = document.getElementById(`slot-${part}`);
    slot.innerHTML = part.toUpperCase();
    slot.classList.add('installed');
    updateStatus();
}

function stripCar() {
    carState = { engine: false, battery: false };
    document.querySelectorAll('.slot').forEach(slot => {
        slot.classList.remove('installed');
        slot.innerHTML = slot.id.replace('slot-', '') + " Slot";
    });
    updateStatus();
}

function updateStatus() {
    const status = document.getElementById('status');
    if (carState.engine && carState.battery) {
        status.innerText = "Status: Car Ready to Drive!";
        status.style.color = "#2ecc71";
    } else {
        status.innerText = "Status: Missing Parts";
        status.style.color = "#e74c3c";
    }
}

function toggleMode() {
    const garage = document.getElementById('garage');
    const track = document.getElementById('track');
    const btn = document.getElementById('mode-btn');

    if (!isDrivingMode) {
        // Check if car works
        if (!carState.engine || !carState.battery) {
            alert("The car won't start! Check the engine and battery.");
            return;
        }
        garage.classList.add('hidden');
        track.classList.remove('hidden');
        btn.innerText = "Return to Garage";
        isDrivingMode = true;
        driveCar();
    } else {
        garage.classList.remove('hidden');
        track.classList.add('hidden');
        btn.innerText = "Test Drive";
        isDrivingMode = false;
        resetCarPosition();
    }
}

function driveCar() {
    const car = document.getElementById('player-car');
    let pos = 0;
    const interval = setInterval(() => {
        if (!isDrivingMode || pos > 550) {
            clearInterval(interval);
        } else {
            pos += 10;
            car.style.left = pos + "px";
        }
    }, 50);
}

function resetCarPosition() {
    document.getElementById('player-car').style.left = "0px";
}