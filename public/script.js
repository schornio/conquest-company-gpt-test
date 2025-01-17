if (document.readyState === 'complete') {
  initializeChatBubble();
} else {
  document.addEventListener('DOMContentLoaded', initializeChatBubble);
}

function initializeChatBubble() {
  const chatBubble = document.createElement('div');
  chatBubble.id = 'chatBubble';
  chatBubble.style.position = 'fixed';
  chatBubble.style.bottom = '90px';
  chatBubble.style.left = '50%';
  chatBubble.style.zIndex = '9999';
  chatBubble.style.width = '100%';
  chatBubble.style.maxWidth = '400px';
  chatBubble.style.height = '100%';
  chatBubble.style.maxHeight = '550px';
  chatBubble.style.transform = 'translateX(-50%)';

  chatBubble.style.borderRadius = '4px';
  chatBubble.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
  chatBubble.style.display = 'none';
  chatBubble.style.overflow = 'hidden';

  const iframe = document.createElement('iframe');
  iframe.src = 'https://conquest-company-gpt-test.vercel.app/public';
  // iframe.src = 'http://localhost:3000/public';
  iframe.width = '100%';
  iframe.height = '100%';
  iframe.style.border = 'none';

  chatBubble.appendChild(iframe);
  document.body.appendChild(chatBubble);

  const toggleButton = document.createElement('button');
  toggleButton.id = 'toggleButton';
  toggleButton.style.position = 'fixed';
  toggleButton.style.bottom = '10px';
  toggleButton.style.left = '50%';
  toggleButton.style.transform = 'translateX(-50%)';
  toggleButton.style.zIndex = '9999';
  toggleButton.style.width = '80px';
  toggleButton.style.height = '80px';
  toggleButton.style.backgroundColor = 'transparent';
  toggleButton.style.border = 'none';
  toggleButton.style.display = 'flex';
  toggleButton.style.alignItems = 'center';
  toggleButton.style.justifyContent = 'center';
  toggleButton.style.cursor = 'pointer';

  const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgIcon.setAttribute('width', '60');
  svgIcon.setAttribute('height', '60');
  svgIcon.setAttribute('viewBox', '0 0 60 60');
  svgIcon.innerHTML =
    '<polygon fill="#E10707" points="15,0 0,26 15,52 30,52 30,60 39.1,52 45,52 60,26 45,0 "/><g><path fill="#FFFFFF" d="M22.7,11.4c-5.5,0-9.9,4.4-9.9,9.9c0,5.5,4.4,9.9,9.9,9.9h14.5c5.5,0,9.9-4.4,9.9-9.9 c0-5.5-4.4-9.9-9.9-9.9H22.7z"/><path fill="#E10707" d="M38.8,24.9c2,0,3.6-1.6,3.6-3.6c0-2-1.6-3.6-3.6-3.6s-3.6,1.6-3.6,3.6C35.2,23.3,36.8,24.9,38.8,24.9"/><path fill="#E10707" d="M21.2,24.9c2,0,3.6-1.6,3.6-3.6c0-2-1.6-3.6-3.6-3.6s-3.6,1.6-3.6,3.6C17.5,23.3,19.2,24.9,21.2,24.9"/></g>';

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
}
