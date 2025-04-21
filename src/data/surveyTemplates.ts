import { Question } from '../context/SurveyContext';
import { v4 as uuidv4 } from 'uuid';

interface SurveyTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  questions: Question[];
}

export const surveyTemplates: SurveyTemplate[] = [
  {
    id: 'customer-satisfaction',
    name: 'Customer Satisfaction',
    category: 'Customer Experience',
    description: 'Measure customer satisfaction with your products or services',
    questions: [
      {
        id: uuidv4(),
        type: 'rating',
        title: 'How would you rate your overall experience with our product/service?',
        required: true,
        description: 'On a scale of 1-5, with 5 being excellent'
      },
      {
        id: uuidv4(),
        type: 'multiple-choice',
        title: 'How likely are you to recommend our product/service to others?',
        required: true,
        options: ['Very likely', 'Likely', 'Neutral', 'Unlikely', 'Very unlikely']
      },
      {
        id: uuidv4(),
        type: 'text',
        title: 'What aspects of our product/service do you like the most?',
        required: false
      },
      {
        id: uuidv4(),
        type: 'text',
        title: 'How can we improve our product/service?',
        required: false
      }
    ]
  },
  {
    id: 'employee-engagement',
    name: 'Employee Engagement',
    category: 'Employee Engagement',
    description: 'Measure employee satisfaction and engagement',
    questions: [
      {
        id: uuidv4(),
        type: 'scale',
        title: 'I feel valued at work',
        required: true,
        description: 'Scale from 1 (Strongly Disagree) to 5 (Strongly Agree)'
      },
      {
        id: uuidv4(),
        type: 'scale',
        title: 'I have the resources I need to do my job effectively',
        required: true,
        description: 'Scale from 1 (Strongly Disagree) to 5 (Strongly Agree)'
      },
      {
        id: uuidv4(),
        type: 'multiple-choice',
        title: 'How satisfied are you with your work-life balance?',
        required: true,
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
      },
      {
        id: uuidv4(),
        type: 'text',
        title: 'What would make your work experience better?',
        required: false
      }
    ]
  },
  {
    id: 'event-feedback',
    name: 'Event Feedback',
    category: 'Event',
    description: 'Collect feedback about an event',
    questions: [
      {
        id: uuidv4(),
        type: 'rating',
        title: 'How would you rate the overall event?',
        required: true,
        description: 'On a scale of 1-5, with 5 being excellent'
      },
      {
        id: uuidv4(),
        type: 'multiple-choice',
        title: 'How satisfied were you with the venue?',
        required: true,
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
      },
      {
        id: uuidv4(),
        type: 'checkbox',
        title: 'Which sessions did you attend?',
        required: true,
        options: ['Keynote', 'Workshop A', 'Workshop B', 'Panel Discussion', 'Networking Event']
      },
      {
        id: uuidv4(),
        type: 'text',
        title: 'What could we do to improve future events?',
        required: false
      }
    ]
  },
  {
    id: 'market-research',
    name: 'Market Research',
    category: 'Market Research',
    description: 'Gather insights about market trends and customer preferences',
    questions: [
      {
        id: uuidv4(),
        type: 'multiple-choice',
        title: 'How often do you use products/services like ours?',
        required: true,
        options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never']
      },
      {
        id: uuidv4(),
        type: 'checkbox',
        title: 'Which features do you value most in a product/service like ours?',
        required: true,
        options: ['Quality', 'Price', 'Customer Service', 'Convenience', 'Brand Reputation']
      },
      {
        id: uuidv4(),
        type: 'dropdown',
        title: 'What is your age range?',
        required: true,
        options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
      },
      {
        id: uuidv4(),
        type: 'text',
        title: 'What improvements would make you more likely to choose our product/service?',
        required: false
      }
    ]
  },
  {
    id: 'course-evaluation',
    name: 'Course Evaluation',
    category: 'Education',
    description: 'Collect feedback about a course or training program',
    questions: [
      {
        id: uuidv4(),
        type: 'rating',
        title: 'How would you rate the course content?',
        required: true,
        description: 'On a scale of 1-5, with 5 being excellent'
      },
      {
        id: uuidv4(),
        type: 'rating',
        title: 'How would you rate the instructor/facilitator?',
        required: true,
        description: 'On a scale of 1-5, with 5 being excellent'
      },
      {
        id: uuidv4(),
        type: 'scale',
        title: 'The course met my expectations',
        required: true,
        description: 'Scale from 1 (Strongly Disagree) to 5 (Strongly Agree)'
      },
      {
        id: uuidv4(),
        type: 'text',
        title: 'What topics would you like to see covered in future courses?',
        required: false
      }
    ]
  }
];