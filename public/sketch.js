const socket = io();
let colorPicker, sizeSlider, canvas, gui, drawIsOn = false, receivedMouseX = 0, receivedMouseY = 0;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  canvas.mousePressed(canvasMousePressed);
  canvas.touchStarted(canvasTouchStarted);

  gui = createDiv('');
  gui.parent('gui-container');
  gui.addClass('open');

  colorPicker = createColorPicker(color(255, 0, 100));
  colorPicker.parent(gui);
  colorPicker.addClass('color-picker');
  colorPicker.input(handleColorPickerInput);

  sizeSlider = createSlider(1, 100, 30);
  sizeSlider.parent(gui);
  sizeSlider.addClass('slider');
  sizeSlider.input(handleSliderInputChange);

  handleSliderInputChange();

  background(255);
  noStroke();
}

function draw() {
  if (drawIsOn) {
    fill(colorPicker.color());
    circle(mouseX, mouseY, sizeSlider.value());
  }
}

function canvasMousePressed() {
  drawIsOn = true;
}

function mouseReleased() {
  drawIsOn = false;
}

function mouseDragged() {
  if (!drawIsOn) {
    return;
  }

  socket.emit("drawing", {
    xpos: mouseX / width,
    ypos: mouseY / height,
    color: colorPicker.color(),
    size: sizeSlider.value()
  });
}

function canvasTouchStarted() {
  drawIsOn = true;
}

function touchEnded() {
  drawIsOn = false;
}

function touchMoved() {
  if (!drawIsOn) {
    return;
  }

  socket.emit("drawing", {
    xpos: mouseX / width,
    ypos: mouseY / height,
    color: colorPicker.color(),
    size: sizeSlider.value()
  });
}

function onDrawingEvent(data) {
  fill(data.color);
  circle(data.xpos * width, data.ypos * height, data.size); //slightly nicer on mobile
}

function handleColorPickerInput() {
  fill(colorPicker.color());
}

function handleSliderInputChange() {
  sizeSlider.style('width', '80px');
  sizeSlider.style('margin-left', '10px');
  sizeSlider.style('margin-right', '10px');
}

function windowResized() {}

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("disconnect", () => {
  console.log(socket.id);
});

socket.on("drawing", (data) => {
  console.log(data);

  onDrawingEvent(data);
});
