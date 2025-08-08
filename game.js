document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('game-board');
  const context = board.getContext('2d');
  const scoreElement = document.getElementById('score');
  const livesElement = document.getElementById('lives');
  const gameOverContainer = document.getElementById('game-over-container');
  const playAgainBtn = document.getElementById('play-again-btn');

  const gridSize = 20;
  let snake, food, direction, score, gameOver, gameLoop, extraLives, isMovingFoodActive;

  const powerUpTypes = {
    SPEED: 'o1.png', // Amarilla
    MOVING_FOOD: 'o2.png', // Blanca
    EXTRA_LIFE: 'o3.png' // Blanca con morado
  };

  let foodImage = new Image();
  let foodMoveInterval;

  function placeFood() {
    if (foodMoveInterval) clearInterval(foodMoveInterval);

    let foodImageSrc;
    let foodType;

    if (isMovingFoodActive) {
      foodImageSrc = powerUpTypes.MOVING_FOOD;
      foodType = 'MOVING_FOOD';
    } else {
      const powerUpKeys = ['SPEED', 'EXTRA_LIFE', 'MOVING_FOOD'];
      foodType = powerUpKeys[Math.floor(Math.random() * powerUpKeys.length)];
      foodImageSrc = powerUpTypes[foodType];
    }

    food = {
      x: Math.random() * (board.width - gridSize * 1.5),
      y: Math.random() * (board.height - gridSize * 1.5),
      type: foodType,
      dx: (Math.random() < 0.5 ? 1 : -1) * 2,
      dy: (Math.random() < 0.5 ? 1 : -1) * 2
    };

    foodImage.src = foodImageSrc;

    if (isMovingFoodActive) {
      foodMoveInterval = setInterval(moveFood, 20);
    }
  }

  function moveFood() {
    food.x += food.dx;
    food.y += food.dy;

    if (food.x < 0 || food.x + gridSize * 1.5 > board.width) food.dx *= -1;
    if (food.y < 0 || food.y + gridSize * 1.5 > board.height) food.dy *= -1;
  }

  function drawGrid() {
    context.strokeStyle = '#dcc9ed';
    for (let x = 0; x < board.width; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, board.height);
      context.stroke();
    }
    for (let y = 0; y < board.height; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(board.width, y);
      context.stroke();
    }
  }

  function draw() {
    context.fillStyle = '#f2e6ff';
    context.fillRect(0, 0, board.width, board.height);
    drawGrid();

    // Dibujar la serpiente
    snake.forEach((segment, index) => {
      // Color cambiante de la serpiente
      const hue = (score * 10 + index * 5) % 360; // Cambia el color con la puntuación y la posición
      context.fillStyle = `hsl(${hue}, 70%, 50%)`;
      context.strokeStyle = `hsl(${hue}, 80%, 40%)`; // Borde más oscuro
      context.lineWidth = 2;

      context.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
      context.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);

      // Efecto brillante (sutil)
      context.fillStyle = `rgba(255, 255, 255, ${0.3 - (index * 0.02)})`; // Más brillante en la cabeza
      context.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 4, gridSize - 4);

      // Dibujar la cabeza de la serpiente
      if (index === 0) {
        context.fillStyle = 'black';
        const eyeSize = gridSize * 0.15;
        const mouthSize = gridSize * 0.3;

        switch (direction) {
          case 'up':
            context.beginPath();
            context.arc(segment.x * gridSize + gridSize * 0.3, segment.y * gridSize + gridSize * 0.3, eyeSize, 0, Math.PI * 2);
            context.arc(segment.x * gridSize + gridSize * 0.7, segment.y * gridSize + gridSize * 0.3, eyeSize, 0, Math.PI * 2);
            context.fill();
            context.fillRect(segment.x * gridSize + gridSize * 0.35, segment.y * gridSize + gridSize * 0.7, mouthSize, 2);
            break;
          case 'down':
            context.beginPath();
            context.arc(segment.x * gridSize + gridSize * 0.3, segment.y * gridSize + gridSize * 0.7, eyeSize, 0, Math.PI * 2);
            context.arc(segment.x * gridSize + gridSize * 0.7, segment.y * gridSize + gridSize * 0.7, eyeSize, 0, Math.PI * 2);
            context.fill();
            context.fillRect(segment.x * gridSize + gridSize * 0.35, segment.y * gridSize + gridSize * 0.3, mouthSize, 2);
            break;
          case 'left':
            context.beginPath();
            context.arc(segment.x * gridSize + gridSize * 0.3, segment.y * gridSize + gridSize * 0.3, eyeSize, 0, Math.PI * 2);
            context.arc(segment.x * gridSize + gridSize * 0.3, segment.y * gridSize + gridSize * 0.7, eyeSize, 0, Math.PI * 2);
            context.fill();
            context.fillRect(segment.x * gridSize + gridSize * 0.7, segment.y * gridSize + gridSize * 0.35, 2, mouthSize);
            break;
          case 'right':
            context.beginPath();
            context.arc(segment.x * gridSize + gridSize * 0.7, segment.y * gridSize + gridSize * 0.3, eyeSize, 0, Math.PI * 2);
            context.arc(segment.x * gridSize + gridSize * 0.7, segment.y * gridSize + gridSize * 0.7, eyeSize, 0, Math.PI * 2);
            context.fill();
            context.fillRect(segment.x * gridSize + gridSize * 0.35, segment.y * gridSize + gridSize * 0.35, 2, mouthSize);
            break;
        }
      }
    });

    context.shadowBlur = 20;
    context.shadowColor = 'rgba(255, 255, 100, 0.8)';
    const foodSize = gridSize * 1.5;
    context.drawImage(foodImage, food.x, food.y, foodSize, foodSize);
    context.shadowBlur = 0;
  }

  function checkCollision() {
    const head = snake[0];
    const foodSize = gridSize * 1.5;
    const snakeX = head.x * gridSize;
    const snakeY = head.y * gridSize;

    return (
      snakeX < food.x + foodSize &&
      snakeX + gridSize > food.x &&
      snakeY < food.y + foodSize &&
      snakeY + gridSize > food.y
    );
  }

  function update() {
    if (gameOver) return;

    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }

    if (head.x < 0 || head.x >= board.width / gridSize || head.y < 0 || head.y >= board.height / gridSize) {
      handleDeath();
      return;
    }

    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        handleDeath();
        return;
      }
    }

    snake.unshift(head);

    if (checkCollision()) {
      score++;
      scoreElement.textContent = `Puntuación: ${score}`;
      activatePowerUp(food.type);
      placeFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function activatePowerUp(type) {
    isMovingFoodActive = false;
    if (foodMoveInterval) clearInterval(foodMoveInterval);

    switch (type) {
      case 'SPEED':
        clearInterval(gameLoop);
        gameLoop = setInterval(update, 80);
        setTimeout(() => {
          clearInterval(gameLoop);
          gameLoop = setInterval(update, 150);
        }, 5000);
        break;
      case 'MOVING_FOOD':
        isMovingFoodActive = true;
        break;
      case 'EXTRA_LIFE':
        extraLives++;
        livesElement.textContent = `Vidas Extra: ${extraLives}`;
        break;
    }
  }

  function changeDirection(event) {
    const key = event.key.toLowerCase();
    const goingUp = direction === 'up';
    const goingDown = direction === 'down';
    const goingLeft = direction === 'left';
    const goingRight = direction === 'right';

    if ((key === 'w' || key === 'arrowup') && !goingDown) direction = 'up';
    if ((key === 's' || key === 'arrowdown') && !goingUp) direction = 'down';
    if ((key === 'a' || key === 'arrowleft') && !goingRight) direction = 'left';
    if ((key === 'd' || key === 'arrowright') && !goingLeft) direction = 'right';
  }

  function handleDeath() {
    if (extraLives > 0) {
      extraLives--;
      livesElement.textContent = `Vidas Extra: ${extraLives}`;
      snake = [
        { x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }
      ];
      direction = 'right';
    } else {
      endGame();
    }
  }

  let shardInterval;

  function endGame() {
    gameOver = true;
    clearInterval(gameLoop);
    if (foodMoveInterval) clearInterval(foodMoveInterval);

    const circularWipeDiv = document.createElement('div');
    circularWipeDiv.classList.add('circular-wipe');
    document.body.appendChild(circularWipeDiv);

    setTimeout(() => {
      gameOverContainer.classList.add('active');
      shardInterval = setInterval(createFountainShard, 1); // Muchas más partículas, muy rápido
      circularWipeDiv.remove();
    }, 800); // Duración de la animación circular
  }

  function createFountainShard() {
    const container = document.getElementById('game-over-container');
    const shard = document.createElement('div');
    shard.className = 'shard';
    const size = Math.random() * 20 + 5;
    shard.style.width = `${size}px`;
    shard.style.height = `${size}px`;
    // Las partículas ahora se originan en posiciones aleatorias de la pantalla
    shard.style.top = `${Math.random() * 100}%`;
    shard.style.left = `${Math.random() * 100}%`;

    // Mayor dispersión en todas direcciones y con cambios de ritmo
    const angle = Math.random() * Math.PI * 2; // Ángulo aleatorio
    const distance = Math.random() * 2000 + 1000; // Distancia de explosión
    const midDistance = distance * 0.5; // Punto medio para el cambio de ritmo

    shard.style.setProperty('--x-mid', `${Math.cos(angle) * midDistance}px`);
    shard.style.setProperty('--y-mid', `${Math.sin(angle) * midDistance}px`);
    shard.style.setProperty('--x-end', `${Math.cos(angle) * distance}px`);
    shard.style.setProperty('--y-end', `${Math.sin(angle) * distance}px`);

    const duration = Math.random() * 5 + 3; // Duración de animación más variada y larga
    shard.style.animationDuration = `${duration}s`;
    shard.style.animationDelay = `${Math.random() * 2}s`; // Mayor retraso aleatorio
    container.appendChild(shard);

    setTimeout(() => {
      shard.remove();
    }, duration * 1000);
  }

  function startGame() {
    if (shardInterval) clearInterval(shardInterval);
    board.style.display = 'block';
    gameOverContainer.classList.remove('active');
    const shards = document.querySelectorAll('.shard');
    shards.forEach(shard => shard.remove());

    snake = [
      { x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }
    ];
    direction = 'right';
    score = 0;
    extraLives = 0;
    gameOver = false;
    isMovingFoodActive = false;
    scoreElement.textContent = `Puntuación: ${score}`;
    livesElement.textContent = `Vidas Extra: ${extraLives}`;
    placeFood();
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, 150);
  }

  playAgainBtn.addEventListener('click', startGame);

  document.addEventListener('keydown', (event) => {
    if (!gameOver) {
      changeDirection(event);
    }
  });

  startGame();
});
