# **App Name**: Ideator AI

## Core Features:

- Selection Input: Users select their target audience and content theme from dropdown menus using Material UI components.
- AI Idea Generator: AI powered product idea generation tool: Based on the audience and theme, the app will generate three distinct ideas: a product, a service, and a membership.
- Loading Animation: Visual cues such as simulated searching and progress indicators that create the perception of the AI working in the background, reinforcing trust. Implement using Material UI Progress and other animation components.
- Result Obfuscation: Implement a blur effect over the generated results using Material UI styling and CSS filters. User will have to enter email to see the unblurred result.
- Data Capture and Transmission: Capture the selected target audience and content theme data, along with the user's email address, and send it to the specified webhook URL.
- Results Presentation: Unblur and display the results when email is given by user using Material UI components for displaying the generated ideas.
- Upsell Blueprint: Offer users an upsell: a complete blueprint for creating and launching the generated product ideas, and upon click send the data to webhook.

## Style Guidelines:

- Primary color: Sky Blue (#72BCD4) to suggest openness and imagination in generating ideas. Use Material UI's theme provider for consistent styling.
- Background color: Very light grayish-blue (#F0F4F7). Use Material UI's theme provider for consistent styling.
- Accent color: Salmon (#D4728A), to give contrast in elements like buttons. Use Material UI's theme provider for consistent styling.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines and short amounts of body text, 'Inter' (sans-serif) for longer body text. Utilize Material UI's Typography component.
- Use clean, modern icons representing target audience and content themes. Use Material UI's Icon component and Material Icons library.
- A clean and intuitive layout that guides the user through the selection process, emphasizing the AI's processing animation, and then clearly presenting results. Use Material UI's Grid, Container, and Box components for layout.
- Use animated progress bars, loading spinners, and subtle transitions to engage the user and enhance the perceived intelligence and activity of the application. Implement using Material UI's Transition and other animation-related components.