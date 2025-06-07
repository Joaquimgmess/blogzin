import type { Meta, StoryObj } from '@storybook/react';
import { Button, buttonVariants } from './button'; // Adjust path if ./button is not correct
import { HomeIcon } from 'lucide-react'; // Example icon

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Button variant',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Button size',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as a child component (e.g., for use with Link)',
    },
    children: {
      control: 'text',
      description: 'Button content (text or ReactNode)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    }
  },
  args: { // Default args for all stories
    children: 'Button Text',
    asChild: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <HomeIcon className="mr-2 h-4 w-4" /> Login
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'outline',
    size: 'icon',
    children: <HomeIcon className="h-4 w-4" />,
  },
};

// Example of using buttonVariants with a Link (asChild pattern)
// This requires react-router-dom's Link or a similar component.
// For Storybook, we might need to mock it or use a simple anchor.
// For demonstration, let's assume a simple anchor tag.
export const AsChildLink: Story = {
  args: {
    asChild: true,
    children: <a href="#">Link via asChild</a>, // Replace with actual Link component if router is available/mocked
    variant: 'default',
  },
  // You might need to add a decorator if your Link component needs a Router context
  // decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
};
