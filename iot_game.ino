int JUMP_PIN = 2;
int LED_PIN  = 13;
int result;

void setup() {
  Serial.begin(9600);
  pinMode(JUMP_PIN, INPUT_PULLUP);
  pinMode(LED_PIN,  OUTPUT);
}


void loop () {
  int jump_status = digitalRead(JUMP_PIN);
  if (jump_status) {
    result = 1; // high - jumped
    digitalWrite(LED_PIN, LOW);
  }
  else {
    result = 0; // low - not jumped
    digitalWrite(LED_PIN, HIGH);
  }

  Serial.println(result);
}
