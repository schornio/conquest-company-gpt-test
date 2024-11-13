document.addEventListener('DOMContentLoaded', () => {
  const chatBubble = document.createElement('div');
  chatBubble.id = 'chatBubble';
  chatBubble.style.position = 'fixed';
  chatBubble.style.bottom = '70px';
  chatBubble.style.right = '10px';
  chatBubble.style.width = '300px';
  chatBubble.style.height = '400px';

  chatBubble.style.borderRadius = '20px';
  chatBubble.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
  chatBubble.style.display = 'none';
  chatBubble.style.overflow = 'hidden';

  const iframe = document.createElement('iframe');
  iframe.src = 'http://localhost:3000/public';
  iframe.width = '100%';
  iframe.height = '100%';
  iframe.style.border = 'none';

  chatBubble.appendChild(iframe);
  document.body.appendChild(chatBubble);

  const toggleButton = document.createElement('button');
  toggleButton.id = 'toggleButton';
  toggleButton.style.position = 'fixed';
  toggleButton.style.bottom = '10px';
  toggleButton.style.right = '10px';
  toggleButton.style.width = '50px';
  toggleButton.style.height = '50px';
  toggleButton.style.borderRadius = '50%';
  toggleButton.style.backgroundColor = 'hsl(0 72.2% 50.6%)';
  toggleButton.style.border = 'none';
  toggleButton.style.display = 'flex';
  toggleButton.style.alignItems = 'center';
  toggleButton.style.justifyContent = 'center';
  toggleButton.style.cursor = 'pointer';

  const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgIcon.setAttribute('width', '24');
  svgIcon.setAttribute('height', '24');
  svgIcon.setAttribute('viewBox', '176 0 19.5 19.5');
  svgIcon.setAttribute('fill', 'white');
  svgIcon.innerHTML =
    '<path class="cls-1" d="m190.1,16.81h-8.28l-.65-1.12,1-3.6c3.77,1.53,7.34,1.65,8.36,1.65h.62s-.21-.45-.21-.45c-.69-1.49-1.07-2.83-1.2-3.31,1.08-1.37,2.11-3.26,2.12-3.28l.14-.25h-.29s-.79.04-1.03.04c-3.2,0-5.85-.9-6.61-1.19l.24-.84-1.34-.55-2.82,10.04-2.48-4.29,4.14-7.17h8.28l4.14,7.17-4.14,7.17Zm-1.85-6.95c.02.06.4,1.43.73,2.34-.95-.08-3.66-.38-6.42-1.53l1.11-3.96c.76.29,3.11,1.1,5.94,1.25-.41.55-1.33,1.74-1.34,1.76l-.05.07.02.08Zm2.73-8.9h-10.04l-5.02,8.69,5.02,8.69h10.04l5.02-8.69-5.02-8.69Z"/>';

  toggleButton.appendChild(svgIcon);

  document.body.appendChild(toggleButton);

  toggleButton.addEventListener('click', () => {
    if (
      chatBubble.style.display === 'none' ||
      chatBubble.style.display === ''
    ) {
      chatBubble.style.display = 'block';
    } else {
      chatBubble.style.display = 'none';
    }
  });
});
