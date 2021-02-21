let N;
let colors = ['#ef4136', '#00aeef']; // azul-rojo
let matrix = [];
let vector = [];
let result = [];
let l = 40;
let x0 = 80;
let y0 = 180;
let Nslider;
let button_vector;
let button_result;
var hidden = 0;
var check_labels;


function setup() {
  var canvas = createCanvas(1000, 900);
  canvas.parent('canvas-div');
  Nslider = createSlider(1, 4, 2);
  Nslider.parent('control1');
  Nslider.position(10, 10, 'relative');
  Nslider.style('width', '100px');
  N = Nslider.value();
  
  matrix = setup_matrix(matrix, 4, x0, y0);
  vector = setup_vector(vector, 4, x0 + pow(2, N)*l + l, y0);
  result = setup_result(result, 4, x0 + pow(2, N)*l + 5*l, y0);
  
  button_vector = createButton('resetear');
  button_vector.parent('control2');
  button_vector.position(10, 10, 'relative');
  
  button_result = createButton('iterar');
  button_result.parent('control3');
  button_result.position(10, 10, 'relative');
  
  check_labels = createCheckbox('', false);
  check_labels.parent('control4');
  check_labels.position(10, 10, 'relative');
  
  
}

function draw() {
  background(220);
  fill(0);
  textAlign(LEFT);
  textSize(12);
  text('Número de qubits: ' + Nslider.value().toString(), 90, 60);
  //text('Estados básicos', 506, 72);
  //textSize(38);
  //text('Matrices de Hadamard', 30, 60);
  
  
  N = Nslider.value();
 
  draw_matrix(matrix, N); 
  draw_vector(vector, x0, y0, N);
  result = update_result(matrix, vector, result, N);
  draw_result(result, x0, y0, N);
  
  for (var i = 0; i < pow(2, N); i++) {
    hidden = 0;
    if (Math.abs(result[i][0].value) > 999) {
      hidden = hidden + 1;
      button_result.hide();
    }
  }
  if (hidden == 0) {
    button_result.show();
  }

  
  
  button_vector.mousePressed(reset);
  button_result.mousePressed(iterate);
  
  check_labels.changed(updateLabels);
  
}

function reset() {
  setup_vector(vector, N, x0, y0);
}

function iterate() {
  for (var i = 0; i < pow(2, N); i++) {
    for (var j = 0; j < pow(2, 0); j++) {
      vector[i][j].value = result[i][j].value; 
    }
  }
}

function updateLabels() {
  draw();
}

function setup_matrix(matrix, N, x0, y0) {
  for (var i = 0; i < pow(2, N); i++) {
    matrix[i] = [];
    for (var j = 0; j < pow(2, N); j++) {
      matrix[i][j] = new Cell(x0 + j*l, y0 + i*l, computeEntry(i, j, N)); 
    }
  }
  return matrix;
}

function setup_vector(matrix, N, x0, y0) {
  for (var i = 0; i < pow(2, N); i++) {
    matrix[i] = [];
    for (var j = 0; j < pow(2, 0); j++) {
      
matrix[i][j] = new Cell(x0 + j*l, y0 + i*l, 1); 
    }
  }
  return matrix;
}

function setup_result(matrix, N, x0, y0) {
  for (var i = 0; i < pow(2, N); i++) {
    matrix[i] = [];
    for (var j = 0; j < pow(2, 0); j++) {
      matrix[i][j] = new Cell(x0 + j*l, y0 + i*l, i == 0 ? 1: 0); 
    }
  }
  return matrix;
}

function update_result(matrix, vector, result, N) {
  for (var i = 0; i < pow(2, N); i++) {
    result[i][0].value = 0;
    for (var j = 0; j < pow(2, N); j++){
      result[i][0].value = result[i][0].value + matrix[i][j].value*vector[j][0].value; 
    }  
    if (result[i][0].value > 0) {
      result[i][0].fill_color = colors[1];  
    }
    if (result[i][0].value < 0) {
      result[i][0].fill_color = colors[0];
    }
     if (result[i][0].value === 0) {
      result[i][0].fill_color = 0;   
    }
  }
  return result;
}

function computeEntry(i, j, L) {
  var num = 0;
  num = pow(-1, dotProduct(toBinary(i, L), toBinary(j, L)));
  return num;
}

function dotProduct(n, m){
  var sum = 0;
  for (var i = 0; i < n.length; i++) {
    sum = sum + n[i]*m[i];
  }
  return sum % 2;
}

function draw_matrix(matrix, N) {
  for (var i = 0; i < pow(2, N); i++) {
    for (var j = 0; j < pow(2, N); j++) {
      matrix[i][j].show(); 
    }
  }
}

function draw_vector(matrix, x0, y0, N) {
  var pos = x0 + pow(2, N)*l + l;
  for (var i = 0; i < pow(2, N); i++) {
    for (var j = 0; j < pow(2, 0); j++) {
      matrix[i][j].x = pos;
      if (check_labels.checked()) {
        fill(0);
        textAlign(LEFT);
        textSize(8);
        text(toBinary(i, N).join(''), pos + 1.2*l, y0 + i*l + l/2);
      }
      matrix[i][j].show(); 
    }
  }
}

function draw_result(matrix, x0, y0, N) {
  textSize(26);
  fill(0);
  text('=', x0 + pow(2, N)*l + 3.5*l, y0 + pow(2, N-1)*l);
  var pos = x0 + pow(2, N)*l + 5*l;
  for (var i = 0; i < pow(2, N); i++) {
    for (var j = 0; j < pow(2, 0); j++) {
      matrix[i][j].x = pos;
      if (check_labels.checked()) {
        fill(0);
        textAlign(LEFT);
        textSize(8);
        text(toBinary(i, N).join(''), pos + 1.2*l, y0 + i*l + l/2);
      }
      matrix[i][j].show(); 
    }
  }
}




function mouseClicked() {
//  for (var i = 0; i < pow(2, N); i++) {
//    for (var j = 0; j < pow(2, N); j++) {
//      matrix[i][j].clicked(); 
//    }
//  }
  for (var i = 0; i < pow(2, N); i++) {
    for (var j = 0; j < pow(2, 0); j++) {
      vector[i][j].clicked(); 
    }
  }
}

function toBinary(n, L) {
  var lista_binaria = [];
  var bit = 0;
  
  for (var i = L - 1; i >= 0; i--) {
    bit = n/pow(2, i)>>0;
    n = n%pow(2, i);
    lista_binaria.push(bit);
  }  
  return lista_binaria;
}


class Cell {
  
  constructor(x, y, value) {
    this.x = x;
    this.y = y;
    this.l = l;
    this.value = value;
    this.border_color = 255;
    this.fill_color = colors[floor((this.value+1)/2)];
    this.text_color = 20;
    this.clickable = true;
    }
  
  show() {
    if (this.value == 0) {
      this.fill_color = 30;
      this.text_color = 240;
    } else {
      this.fill_color = colors[floor(((this.value)/Math.abs(this.value)+1)/2)];
      this.text_color = 20;
    }
    stroke(this.border_color);
    strokeWeight(3);
    fill(this.fill_color);
    rect(this.x, this.y, this.l, this.l, 1);
    noStroke();
    fill(this.text_color);
    textSize(14);
    textAlign(CENTER, CENTER);
    text(str(this.value), this.x + this.l/2 , this.y + this.l/2 );
  }
  
  clicked() {
    if (this.clickable == true) {
      if ((mouseX > this.x && mouseX < this.x + this.l) && (mouseY > this.y && mouseY < this.y + this.l)) {
        this.value = this.value * -1;
        this.fill_color = colors[floor((this.value+1)/2)];
      }
    } 
  }
}
