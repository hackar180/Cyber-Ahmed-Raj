
const BOT_TOKEN = '8557024709:AAGNFgSQTM1rCOovDWFrHf7tmYEFYI1ciK0';
const CHAT_ID = '8438764963';

export const sendTelegramAlert = async (message: string) => {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: `🚨 সিকিউরিটি এলার্ট (Cyber Ethical Hacker):\n\n${message}`,
        parse_mode: 'Markdown',
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Telegram notification failed:', error);
    return null;
  }
};
