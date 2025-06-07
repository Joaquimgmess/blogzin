import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction, // Assuming CardAction is exported, if not, remove or handle
  CardDescription,
  CardContent,
} from './card'; // Adjust path if ./card is not correct
import { Button } from './button'; // For actions in card
import { HomeIcon } from 'lucide-react'; // Example icon

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered', // Or 'padded' if cards are wide
  },
  tags: ['autodocs'],
  argTypes: {
    // Args for the Card wrapper itself, if any (e.g., custom class)
    className: { control: 'text', description: 'Custom CSS class for Card wrapper' },
  },
  // Subcomponents are often best documented by showing them in composed examples
  // rather than trying to control all their individual props from the top-level Card args.
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-[350px]', // Example width for a default card
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description - useful for context.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card. It can hold various elements like text, images, or forms.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">View Details</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  args: {
    className: 'w-[350px]',
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Manage your profile settings.</CardDescription>
        {/* CardAction is often used within CardHeader */}
        <CardAction>
          <Button variant="ghost" size="icon">
            <HomeIcon className="h-5 w-5" /> {/* Using HomeIcon as a placeholder */}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Your profile information is displayed here. Click the icon in the header for an action.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm">Dismiss</Button>
        <Button size="sm">Save Changes</Button>
      </CardFooter>
    </Card>
  ),
};

export const SimpleContent: Story = {
  args: {
    className: 'w-[300px]',
  },
  render: (args) => (
    <Card {...args}>
      <CardContent className="pt-6"> {/* Add padding if header/footer are omitted */}
        <h3 className="font-semibold mb-2">Simple Card</h3>
        <p className="text-sm text-muted-foreground">This card only has content, no header or footer.</p>
      </CardContent>
    </Card>
  ),
};

export const OnlyHeaderAndFooter: Story = {
  args: {
    className: 'w-[350px]',
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Task Status</CardTitle>
      </CardHeader>
      <CardFooter>
        <p className="text-sm text-muted-foreground">Task completed successfully.</p>
      </CardFooter>
    </Card>
  ),
};

// Story focusing on Card components composition
export const FullComposition: Story = {
  name: "All Card Components",
  args: {
    className: 'w-[400px]',
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <div className="flex flex-col">
          <CardTitle>Comprehensive Example</CardTitle>
          <CardDescription>Showcasing all parts of the card.</CardDescription>
        </div>
        <CardAction>
          <Button variant="secondary" size="sm">Action</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>
          The main content area can include any React nodes. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <img src="https://via.placeholder.com/300x100.png?text=Placeholder+Image" alt="Placeholder" className="mt-4 rounded-md" />
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </CardFooter>
    </Card>
  ),
};
