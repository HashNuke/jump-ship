int JUMP_PIN = 2;
int result;

void setup() {
  Serial.begin(9600);
  pinMode(JUMP_PIN, INPUT_PULLUP);
}


void loop () {
  int jump_status = digitalRead(JUMP_PIN);
  if (jump_status)
  result = 1; // high - jumped
  else
  result = 0; // low - not jumped

  Serial.println(result);
  delay(1000);
}
