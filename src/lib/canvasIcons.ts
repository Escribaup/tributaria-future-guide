// Canvas icon drawing utilities for infographic generation

export const drawIcon = (
  ctx: CanvasRenderingContext2D,
  iconName: string,
  x: number,
  y: number,
  size: number,
  color: string = '#1e6efb'
) => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (iconName) {
    case 'TrendingUp':
      // Arrow trending upward
      ctx.beginPath();
      ctx.moveTo(x, y + size);
      ctx.lineTo(x + size * 0.6, y + size * 0.3);
      ctx.lineTo(x + size, y);
      ctx.stroke();
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(x + size, y);
      ctx.lineTo(x + size * 0.7, y);
      ctx.lineTo(x + size, y + size * 0.3);
      ctx.closePath();
      ctx.fill();
      break;

    case 'Calculator':
      // Rectangle
      ctx.strokeRect(x, y, size, size);
      // Top display area
      ctx.strokeRect(x + size * 0.15, y + size * 0.15, size * 0.7, size * 0.2);
      // Grid dots for buttons
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          ctx.beginPath();
          ctx.arc(
            x + size * 0.25 + col * size * 0.25,
            y + size * 0.5 + row * size * 0.2,
            2,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
      break;

    case 'FileText':
      // Document outline
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + size * 0.65, y);
      ctx.lineTo(x + size, y + size * 0.35);
      ctx.lineTo(x + size, y + size);
      ctx.lineTo(x, y + size);
      ctx.closePath();
      ctx.stroke();
      // Folded corner
      ctx.beginPath();
      ctx.moveTo(x + size * 0.65, y);
      ctx.lineTo(x + size * 0.65, y + size * 0.35);
      ctx.lineTo(x + size, y + size * 0.35);
      ctx.stroke();
      // Lines
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x + size * 0.15, y + size * 0.5 + i * size * 0.15);
        ctx.lineTo(x + size * 0.85, y + size * 0.5 + i * size * 0.15);
        ctx.stroke();
      }
      break;

    case 'Users':
      // Two people
      // First person (left)
      ctx.beginPath();
      ctx.arc(x + size * 0.35, y + size * 0.25, size * 0.15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + size * 0.35, y + size * 0.7, size * 0.25, Math.PI, 0, true);
      ctx.stroke();
      // Second person (right)
      ctx.beginPath();
      ctx.arc(x + size * 0.65, y + size * 0.25, size * 0.15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + size * 0.65, y + size * 0.7, size * 0.25, Math.PI, 0, true);
      ctx.stroke();
      break;

    case 'ShieldCheck':
      // Shield
      ctx.beginPath();
      ctx.moveTo(x + size * 0.5, y);
      ctx.lineTo(x + size, y + size * 0.3);
      ctx.lineTo(x + size, y + size * 0.6);
      ctx.lineTo(x + size * 0.5, y + size);
      ctx.lineTo(x, y + size * 0.6);
      ctx.lineTo(x, y + size * 0.3);
      ctx.closePath();
      ctx.stroke();
      // Check mark
      ctx.beginPath();
      ctx.moveTo(x + size * 0.3, y + size * 0.5);
      ctx.lineTo(x + size * 0.45, y + size * 0.65);
      ctx.lineTo(x + size * 0.7, y + size * 0.35);
      ctx.stroke();
      break;

    case 'Database':
      // Cylinder
      const ellipseY = y + size * 0.15;
      ctx.beginPath();
      ctx.ellipse(x + size * 0.5, ellipseY, size * 0.5, size * 0.15, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Sides
      ctx.beginPath();
      ctx.moveTo(x, ellipseY);
      ctx.lineTo(x, y + size * 0.85);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + size, ellipseY);
      ctx.lineTo(x + size, y + size * 0.85);
      ctx.stroke();
      // Bottom
      ctx.beginPath();
      ctx.ellipse(x + size * 0.5, y + size * 0.85, size * 0.5, size * 0.15, 0, 0, Math.PI);
      ctx.stroke();
      break;

    case 'Calendar':
      // Rectangle
      ctx.strokeRect(x, y + size * 0.2, size, size * 0.8);
      // Top bar
      ctx.fillRect(x, y + size * 0.2, size, size * 0.15);
      // Rings
      ctx.strokeRect(x + size * 0.2, y, size * 0.1, size * 0.25);
      ctx.strokeRect(x + size * 0.7, y, size * 0.1, size * 0.25);
      // Grid
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x, y + size * 0.35 + i * size * 0.2);
        ctx.lineTo(x + size, y + size * 0.35 + i * size * 0.2);
        ctx.stroke();
      }
      break;

    case 'BarChart3':
      // Three bars
      const barWidth = size * 0.2;
      const bars = [0.4, 0.7, 0.5];
      bars.forEach((height, i) => {
        ctx.fillRect(
          x + i * size * 0.35,
          y + size * (1 - height),
          barWidth,
          size * height
        );
      });
      break;

    case 'Lightbulb':
      // Bulb
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y + size * 0.35, size * 0.3, 0, Math.PI * 2);
      ctx.stroke();
      // Base
      ctx.strokeRect(x + size * 0.35, y + size * 0.65, size * 0.3, size * 0.2);
      // Bottom cap
      ctx.fillRect(x + size * 0.3, y + size * 0.85, size * 0.4, size * 0.1);
      // Light rays
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 6) * i - Math.PI / 4;
        ctx.beginPath();
        ctx.moveTo(
          x + size * 0.5 + Math.cos(angle) * size * 0.35,
          y + size * 0.35 + Math.sin(angle) * size * 0.35
        );
        ctx.lineTo(
          x + size * 0.5 + Math.cos(angle) * size * 0.5,
          y + size * 0.35 + Math.sin(angle) * size * 0.5
        );
        ctx.stroke();
      }
      break;

    case 'CheckCircle2':
      // Circle
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y + size * 0.5, size * 0.45, 0, Math.PI * 2);
      ctx.stroke();
      // Check mark
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + size * 0.3, y + size * 0.5);
      ctx.lineTo(x + size * 0.45, y + size * 0.65);
      ctx.lineTo(x + size * 0.75, y + size * 0.3);
      ctx.stroke();
      break;

    case 'AlertTriangle':
      // Triangle
      ctx.beginPath();
      ctx.moveTo(x + size * 0.5, y);
      ctx.lineTo(x + size, y + size);
      ctx.lineTo(x, y + size);
      ctx.closePath();
      ctx.stroke();
      // Exclamation mark
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + size * 0.5, y + size * 0.3);
      ctx.lineTo(x + size * 0.5, y + size * 0.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y + size * 0.75, 2, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'Target':
      // Concentric circles
      for (let i = 3; i > 0; i--) {
        ctx.beginPath();
        ctx.arc(x + size * 0.5, y + size * 0.5, (size * 0.45 * i) / 3, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Center dot
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y + size * 0.5, 3, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'Zap':
      // Lightning bolt
      ctx.beginPath();
      ctx.moveTo(x + size * 0.6, y);
      ctx.lineTo(x + size * 0.2, y + size * 0.55);
      ctx.lineTo(x + size * 0.5, y + size * 0.55);
      ctx.lineTo(x + size * 0.4, y + size);
      ctx.lineTo(x + size * 0.8, y + size * 0.45);
      ctx.lineTo(x + size * 0.5, y + size * 0.45);
      ctx.closePath();
      ctx.fill();
      break;

    default:
      // Default: circle bullet point
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y + size * 0.5, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
  }

  ctx.restore();
};
