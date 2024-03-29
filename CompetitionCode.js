//===============[ Global Variables ]===============\\
const leftSensor = sensors.color1;
const rightSensor = sensors.color2;
const ultraSensor = sensors.ultrasonic4;
const mainMotors = motors.largeAB;
const clawMotor = motors.mediumC;
const GREEN = ColorSensorColor.Green;
const BLUE = ColorSensorColor.Blue;
const SHARPNESS = 3;
const SPEED = 30;
let waterTime = 0;
let forwardTime = 0;
let turningTime = 0;
let firstRun = true;
let chemicalSpillRunning = false;
let running = "Moving";

//===============[ Initialization & Looping Functions ]===============\\
loops.forever(function () {
    if (firstRun == true) {
        brick.showString("Initialising...", 1);
        if (GetLeftReflected() != 0) {
            brick.showString("Sensors Active!", 1);
            firstRun = false;
        }
    }
    else {
        MoveRobot();
        Intersection();
        WaterTower();
        PrintValues();
        if (waterTime != 100) {
            waterTime += 1;
        }
    }
})

//===============[ Primary Functions ] ===============\\
function MoveRobot() {
    if (chemicalSpillRunning == false) {
        brick.setStatusLight(StatusLight.Green);
        running = "Moving...";
        mainMotors.steer(GetDirection(), SPEED);
    }
}

function Intersection() {
    if (
        hemicalSpillRunning == false) {
        if (GetLeftReflected() < 30 && GetRightReflected() < 30) {
            brick.setStatusLight(StatusLight.Orange);
            running = "T Intersection...";
            mainMotors.tank(10, 10, 0.75, MoveUnit.Seconds);
            motors.stopAll();
            pause(100);
            if ((GetLeftColor() == GREEN || GetLeftColor() == BLUE) && (GetRightColor() == GREEN || GetRightColor() == BLUE) && chemicalSpillRunning == false) {
                ChemicalSpill();
            }
            else if (GetLeftColor() == GREEN) {
                brick.setStatusLight(StatusLight.OrangeFlash);
                running = "Turning Left...";
                mainMotors.tank(10, 20, .5, MoveUnit.Seconds);
            }
            else if (GetRightColor() == GREEN) {
                brick.setStatusLight(StatusLight.OrangeFlash);
                running = "Turning Right...";
                mainMotors.tank(20, 10, .5, MoveUnit.Seconds);
            }
            else {
                return;
            }
        }
    }
}

function ChemicalSpill() {
    if (chemicalSpillRunning == false) {
        chemicalSpillRunning = true;
        brick.setStatusLight(StatusLight.RedFlash);
        running = "Entered Chemical Spill..."
        mainMotors.tank(20, -10, 1.5, MoveUnit.Seconds)
        clawMotor.run(25, 2, MoveUnit.Seconds);
        VictimRescue();
    }
    else {
        return;
    }
}

function VictimRescue() {
    loops.forever(function () {
        brick.setStatusLight(StatusLight.RedFlash);
        running = "Locating Can...";
        PrintValues();
        if (ultraSensor.distance() > 8 && ultraSensor.distance() < 40) {
            mainMotors.tank(10, 10, 1, MoveUnit.Seconds);
            forwardTime += 1;
        }
        else if (ultraSensor.distance() < 8) {
            brick.setStatusLight(StatusLight.GreenFlash);
            running = "Collecting Can..."
            mainMotors.tank(-5, 5, .5, MoveUnit.Seconds);
            mainMotors.tank(10, 10, 1, MoveUnit.Seconds);
            mainMotors.tank(5, -5, .5, MoveUnit.Seconds);
            mainMotors.tank(10, 10, 1, MoveUnit.Seconds);
            clawMotor.run(-15, 3, MoveUnit.Seconds);
            mainMotors.tank(-10, -10, 1, MoveUnit.Seconds);
            mainMotors.tank(-5, 5, .5, MoveUnit.Seconds);
            mainMotors.tank(-10, -10, 1, MoveUnit.Seconds);
            mainMotors.tank(5, -5, .5, MoveUnit.Seconds);
            ExitChemicalSpill();
            return;
        }
        else {
            mainMotors.tank(-5, 5, 1, MoveUnit.Seconds);
            turningTime += 1;
        }
    })
}

function ExitChemicalSpill() {
    brick.setStatusLight(StatusLight.GreenFlash);
    running = "Exiting Chemical Spill..."
    mainMotors.tank(-10, -10, forwardTime, MoveUnit.Seconds);
    mainMotors.tank(5, -5, turningTime, MoveUnit.Seconds);
    mainMotors.tank(5, 5, 2, MoveUnit.Seconds);
    mainMotors.tank(5, -5, 2, MoveUnit.Seconds);
    mainMotors.tank(5, 5, 2, MoveUnit.Seconds)
    clawMotor.run(15, 3, MoveUnit.Seconds);
    mainMotors.tank(-5, -5, 2, MoveUnit.Seconds);
    clawMotor.run(-25, 2, MoveUnit.Seconds);
    mainMotors.tank(-5, -5, 2, MoveUnit.Seconds);
    mainMotors.tank(20, -10, 2.75, MoveUnit.Seconds);
    chemicalSpillRunning = false;
}

function WaterTower() {
    if (waterTime >= 100 && chemicalSpillRunning == false) {
        if (ultraSensor.distance() <= 9 && ultraSensor.distance() > 7.75) {
            brick.setStatusLight(StatusLight.OrangeFlash);
            running = "Water Tower...";
            mainMotors.steer(GetDirection() * -1, -10, 1, MoveUnit.Seconds);
            mainMotors.tank(0, 10, 3.2, MoveUnit.Seconds);
            mainMotors.tank(25, 25, .6, MoveUnit.Seconds);
            mainMotors.tank(20, 0, 1.6, MoveUnit.Seconds);
            mainMotors.tank(25, 25, 1.75, MoveUnit.Seconds);
            mainMotors.tank(20, 0, 1.5, MoveUnit.Seconds);
            while (GetRightReflected() > 60) {
                mainMotors.tank(10, 10, .5, MoveUnit.Seconds);
            }
            mainMotors.tank(0, 20, 1.65, MoveUnit.Seconds);
        }
    }
}

//===============[ Helper Functions ]===============\\
function GetLeftReflected() {
    return leftSensor.light(LightIntensityMode.Reflected);
}

function GetRightReflected() {
    return rightSensor.light(LightIntensityMode.Reflected);
}

function GetLeftColor() {
    leftSensor.color();
    pause(50);
    const leftColor = leftSensor.color();
    GetLeftReflected();
    pause(50);
    return leftColor;
}

function GetRightColor() {
    rightSensor.color();
    pause(50);
    const rightColor = rightSensor.color();
    GetRightReflected();
    pause(50);
    return rightColor;
}

function GetSensorDifference() {
    return GetLeftReflected() - GetRightReflected();
}

function GetDirection() {
    return GetSensorDifference() * SHARPNESS;
}

function PrintValues() {
    brick.showString("Status: ", 1);
    brick.showString(running, 2);
    brick.showValue("LeftSensor", GetLeftReflected(), 4);
    brick.showValue("RightSensor", GetRightReflected(), 5);
    brick.showValue("Direction", GetDirection(), 6);
    brick.showValue("UltraSensor", ultraSensor.distance(), 7);
}
