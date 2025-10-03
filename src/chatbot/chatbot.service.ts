import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ChatbotService {
  private openaiApiKey = process.env.OPENAI_API_KEY;
  private openaiApiUrl = 'https://api.openai.com/v1/chat/completions';


  async createThread(userId: string): Promise<any> {
    return { success: true, threadId: `thread_${userId}_${Date.now()}` };
  }

  async sendMessage(userId: string, message: string, language: string = 'en'): Promise<any> {
    return this.processMessage(userId, message, language);
  }



  async getConversationHistory(userId: string): Promise<any> {
    return { success: true, messages: [] };
  }

  async clearThread(userId: string): Promise<any> {
    return { success: true, message: 'Thread cleared' };
  }

  async createSupportTicket(userId: string, subject: string, description: string, category: string): Promise<any> {
    return { success: true, ticketId: `KER-${Date.now()}`, message: 'Support ticket created' };
  }

  async processMessage(userId: string, message: string, language: string = 'en'): Promise<any> {
    let response: string;
    let source: string;

    if (this.openaiApiKey) {
      response = await this.getOpenAIResponse(message);
      source = 'openai';
    } else {
      response = this.getLocalResponse(message, language);
      source = 'local';
    }

    return {
      success: true,
      response,
      timestamp: new Date().toISOString(),
      source
    };
  }



  private async getOpenAIResponse(message: string): Promise<string> {
    if (!this.openaiApiKey) {
      console.warn('OpenAI API key not configured, falling back to local responses');
      return this.getLocalResponse(message, 'en');
    }

    try {
      const response = await axios.post(this.openaiApiUrl, {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are KERIDES customer support AI assistant. KERIDES is Kerala's premier ride-booking platform.

CRITICAL RULES:
- Company: KERIDES (never "GO KERALL")
- Website: kerides.com
- WhatsApp: +91 75588 89456

CUSTOMER SUPPORT EXPERTISE:
- Booking assistance & ride tracking
- Payment issues & refunds
- Account problems & login help
- Driver delays & safety concerns
- Technical app issues
- Tourism recommendations
- Driver registration queries

KERIDES SERVICES:
- Zero commission (drivers keep 100%)
- All Kerala coverage
- Vehicles: Hatchback ₹12/km, Sedan ₹15/km, SUV ₹18/km
- Services: City rides, outstation, airport, tourism

RESPONSE STYLE:
- Professional, helpful, solution-focused
- Use emojis appropriately
- Provide specific actionable steps
- Always include contact information
- Prioritize customer safety

For emergencies, immediately provide:
- Emergency number: 100
- KERIDES support: +91 75588 89456
- Request booking ID and location

Always end with KERIDES contact info and booking promotion.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API error:', error.response?.data || error.message);
      return this.getLocalResponse(message, 'en');
    }
  }

  private getLocalResponse(message: string, language: string): string {
    const msg = message.toLowerCase();
    
    // Greetings
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('namaste')) {
      return `Hello! Welcome to KERIDES 🚗✨

I'm your customer support assistant. I can help with:
• Booking rides across Kerala
• Account & payment issues
• Driver support & tracking
• Tourism recommendations
• Safety concerns

Visit kerides.com or WhatsApp +91 75588 89456
What can I help you with today?`;
    }

    // Booking queries
    if (msg.includes('book') || msg.includes('ride') || msg.includes('cab') || msg.includes('taxi')) {
      return `🚗 KERIDES Booking Process:

1. Visit kerides.com
2. Login with mobile + OTP
3. Set pickup location
4. Choose destination in Kerala
5. Select vehicle type:
   • Hatchback: ₹12/km
   • Sedan: ₹15/km
   • SUV: ₹18/km
6. Pick available driver
7. Confirm & track ride

✨ Zero commission - drivers keep 100%!
WhatsApp support: +91 75588 89456`;
    }

    // Driver issues
    if (msg.includes('driver') && (msg.includes('late') || msg.includes('delayed') || msg.includes('not arrived') || msg.includes('where'))) {
      return `🚨 Driver Issue Support:

Immediate Actions:
• WhatsApp us: +91 75588 89456
• Share your booking ID
• We'll contact driver for live location

We will:
✓ Get real-time driver location & ETA
✓ Arrange replacement if needed
✓ Ensure you reach destination safely
✓ Process refund if applicable

Your safety is our priority!`;
    }

    // Payment issues
    if (msg.includes('payment') || msg.includes('refund') || msg.includes('money') || msg.includes('charge')) {
      return `💳 Payment Support:

Common Issues:
• Failed payments - Auto refund in 3-5 days
• Wrong charges - Immediate review
• Refund status - Track via app
• Payment methods - UPI, Cards, Wallet

Quick Resolution:
📱 WhatsApp: +91 75588 89456
🌐 Visit: kerides.com/support

Share booking ID for faster processing.`;
    }

    // Account issues
    if (msg.includes('account') || msg.includes('login') || msg.includes('otp') || msg.includes('profile')) {
      return `👤 Account Support:

Login Issues:
• OTP not received - Check network/spam
• Account locked - Contact support
• Profile update - Via app settings
• Phone number change - Verification needed

Solutions:
📱 WhatsApp: +91 75588 89456
🔄 Try different network for OTP
📧 Check spam folder

Need immediate help? Contact us now!`;
    }

    // Safety concerns
    if (msg.includes('safety') || msg.includes('emergency') || msg.includes('help') || msg.includes('unsafe')) {
      return `🚨 EMERGENCY SAFETY SUPPORT:

Immediate Actions:
📞 Emergency: 100 (Police)
📱 KERIDES Support: +91 75588 89456

Safety Features:
• Live ride tracking
• Driver verification
• SOS button in app
• 24/7 support team

Share your location & booking ID immediately.
Your safety is our top priority!`;
    }

    // Tourism queries
    if (msg.includes('tourism') || msg.includes('places') || msg.includes('visit') || msg.includes('kochi') || msg.includes('munnar')) {
      return `🌴 Kerala Tourism with KERIDES:

Popular Destinations:
• Kochi: Backwaters, Fort Kochi (₹1,500)
• Munnar: Tea gardens, hills (₹2,800)
• Alleppey: Houseboats (₹1,800)
• Thekkady: Wildlife (₹3,200)
• Wayanad: Nature (₹2,500)

Tourism Packages:
✓ Airport transfers
✓ Multi-city tours
✓ Custom itineraries

Book at kerides.com or WhatsApp +91 75588 89456`;
    }

    // App issues
    if (msg.includes('app') || msg.includes('technical') || msg.includes('bug') || msg.includes('not working')) {
      return `🔧 Technical Support:

Common Fixes:
• Update app to latest version
• Clear app cache
• Restart phone
• Check internet connection

Still having issues?
📱 WhatsApp: +91 75588 89456
🌐 Web version: kerides.com

Describe the problem for quick resolution.`;
    }

    // Driver registration
    if (msg.includes('driver registration') || msg.includes('become driver') || msg.includes('join as driver')) {
      return `🚗 Join KERIDES as Driver:

Benefits:
✓ Zero commission - Keep 100% earnings
✓ Flexible working hours
✓ All Kerala coverage
✓ Instant payments

Requirements:
• Valid driving license
• Vehicle registration
• Aadhaar card
• Bank account

Apply: kerides.com/driver
WhatsApp: +91 75588 89456`;
    }

    // Default comprehensive response
    return `🚗 KERIDES Customer Support

I can help with:
• 🚕 Booking rides & tracking
• 💳 Payment & refund issues
• 👤 Account & login problems
• 🚨 Safety & emergency support
• 🌴 Kerala tourism packages
• 🔧 Technical app issues
• 🚗 Driver registration

Quick Contact:
📱 WhatsApp: +91 75588 89456
🌐 Website: kerides.com

What specific issue can I help resolve?`;
  }


}