//===============[ Global Variables ]===============\\
const LeftSensor = sensors.color1;
const RightSensor = sensors.color2;
const UltraSensor = sensors.ultrasonic4;
const MainMotors = motors.largeAB;
const ClawMotor = motors.mediumC;
const GREEN = ColorSensorColor.Green;
const BLUE = ColorSensorColor.Blue;
const SHARPNESS = 3;
const Speed = 30;
let WaterTime = 0;
let ForwardTime = 0;
let TurningTime = 0;
let FirstRun = true;
let ChemicalSpillRunning = false;
let Running = "Moving";

//===============[ Initialization & Looping Functions ]===============\\
loops.forever(function () {
    if (FirstRun == true) {
        brick.showString("Initialising...", 1);
        if (GetLeftReflected() != 0) {
            brick.showString("Sensors Active!", 1);
            FirstRun = false;
        }
    }
    else {
        MoveRobot();
        Intersection();
        WaterTower();
        PrintValues();
        if (WaterTime != 100) {
            WaterTime += 1;
        }
    }
})

//===============[ Primary Functions ] ===============\\
function MoveRobot() {
    if (ChemicalSpillRunning == false) {
        brick.setStatusLight(StatusLight.Green);
        Running = "Moving...";
        MainMotors.steer(GetDirection(), Speed);
    }
}

function Intersection() {
    if (ChemicalSpillRunning == false) {
        if (GetLeftReflected() < 30 && GetRightReflected() < 30) {
            brick.setStatusLight(StatusLight.Orange);
            Running = "T Intersection...";
            MainMotors.tank(10, 10, 0.75, MoveUnit.Seconds);
            motors.stopAll();
            pause(100);
            if ((GetLeftColor() == GREEN || GetLeftColor() == BLUE) && (GetRightColor() == GREEN || GetRightColor() == BLUE) && ChemicalSpillRunning == false) {
                ChemicalSpill();
            }
            else if (GetLeftColor() == GREEN) {
                brick.setStatusLight(StatusLight.OrangeFlash);
                Running = "Turning Left...";
                MainMotors.tank(10, 20, .5, MoveUnit.Seconds);
            }
            else if (GetRightColor() == GREEN) {
                brick.setStatusLight(StatusLight.OrangeFlash);
                Running = "Turning Right...";
                MainMotors.tank(20, 10, .5, MoveUnit.Seconds);
            }
            else {
                return;
            }
        }
    }
}

function ChemicalSpill() {
    if (ChemicalSpillRunning == false) {
        ChemicalSpillRunning = true;
        brick.setStatusLight(StatusLight.RedFlash);
        Running = "Entered Chemical Spill..."
        MainMotors.tank(20, -10, 1.5, MoveUnit.Seconds)
        ClawMotor.run(25, 2, MoveUnit.Seconds);
        VictimRescue();
    }
    else {
        return;
    }
}

function VictimRescue() {
    loops.forever(function () {
        brick.setStatusLight(StatusLight.RedFlash);
        Running = "Locating Can...";
        PrintValues();
        if (UltraSensor.distance() > 8 && UltraSensor.distance() < 40) {
            MainMotors.tank(10, 10, 1, MoveUnit.Seconds);
            ForwardTime += 1;
        }
        else if (UltraSensor.distance() < 8) {
            brick.setStatusLight(StatusLight.GreenFlash);
            Running = "Collecting Can..."
            MainMotors.tank(-5, 5, .5, MoveUnit.Seconds);
            MainMotors.tank(10, 10, 1, MoveUnit.Seconds);
            MainMotors.tank(5, -5, .5, MoveUnit.Seconds);
            MainMotors.tank(10, 10, 1, MoveUnit.Seconds);
            ClawMotor.run(-15, 3, MoveUnit.Seconds);
            MainMotors.tank(-10, -10, 1, MoveUnit.Seconds);
            MainMotors.tank(-5, 5, .5, MoveUnit.Seconds);
            MainMotors.tank(-10, -10, 1, MoveUnit.Seconds);
            MainMotors.tank(5, -5, .5, MoveUnit.Seconds);
            ExitChemicalSpill();
            return;
        }
        else {
            MainMotors.tank(-5, 5, 1, MoveUnit.Seconds);
            TurningTime += 1;
        }
    })
}

function ExitChemicalSpill() {
    brick.setStatusLight(StatusLight.GreenFlash);
    Running = "Exiting Chemical Spill..."
    MainMotors.tank(-10, -10, ForwardTime, MoveUnit.Seconds);
    MainMotors.tank(5, -5, TurningTime, MoveUnit.Seconds);
    MainMotors.tank(5, 5, 2, MoveUnit.Seconds);
    MainMotors.tank(5, -5, 2, MoveUnit.Seconds);
    MainMotors.tank(5, 5, 2, MoveUnit.Seconds)
    ClawMotor.run(15, 3, MoveUnit.Seconds);
    MainMotors.tank(-5, -5, 2, MoveUnit.Seconds);
    ClawMotor.run(-25, 2, MoveUnit.Seconds);
    MainMotors.tank(-5, -5, 2, MoveUnit.Seconds);
    MainMotors.tank(20, -10, 2.75, MoveUnit.Seconds);
    ChemicalSpillRunning = false;
}

function WaterTower() {
    if (WaterTime >= 100 && ChemicalSpillRunning == false) {
        if (UltraSensor.distance() <= 9 && UltraSensor.distance() > 7.75) {
            brick.setStatusLight(StatusLight.OrangeFlash);
            Running = "Water Tower...";
            MainMotors.steer(GetDirection() * -1, -10, 1, MoveUnit.Seconds);
            MainMotors.tank(0, 10, 3.2, MoveUnit.Seconds);
            MainMotors.tank(25, 25, .6, MoveUnit.Seconds);
            MainMotors.tank(20, 0, 1.6, MoveUnit.Seconds);
            MainMotors.tank(25, 25, 1.75, MoveUnit.Seconds);
            MainMotors.tank(20, 0, 1.5, MoveUnit.Seconds);
            while (GetRightReflected() > 60) {
                MainMotors.tank(10, 10, .5, MoveUnit.Seconds);
            }
            MainMotors.tank(0, 20, 1.65, MoveUnit.Seconds);
        }
    }
}

//===============[ Helper Functions ]===============\\
function GetLeftReflected() {
    return LeftSensor.light(LightIntensityMode.Reflected);
}

function GetRightReflected() {
    return RightSensor.light(LightIntensityMode.Reflected);
}

function GetLeftColor() {
    LeftSensor.color();
    pause(50);
    const LeftColor = LeftSensor.color();
    GetLeftReflected();
    pause(50);
    return LeftColor;
}

function GetRightColor() {
    RightSensor.color();
    pause(50);
    const RightColor = RightSensor.color();
    GetRightReflected();
    pause(50);
    return RightColor;
}

function GetSensorDifference() {
    return GetLeftReflected() - GetRightReflected();
}

function GetDirection() {
    const Direction = GetSensorDifference() * SHARPNESS;
    return Direction;
}

function PrintValues() {
    brick.showString("Status: ", 1);
    brick.showString(Running, 2);
    brick.showValue("LeftSensor", GetLeftReflected(), 4);
    brick.showValue("RightSensor", GetRightReflected(), 5);
    brick.showValue("Direction", GetDirection(), 6);
    brick.showValue("UltraSensor", UltraSensor.distance(), 7);
}
