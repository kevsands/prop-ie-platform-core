import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Mail, ArrowRight, Plus, Check } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
        "success",
        "warning",
        "info",
        "subtle",
        "brand",
      ],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "xl", "icon", "icon-sm", "icon-lg"],
    },
    isLoading: {
      control: "boolean",
    },
    fullWidth: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
    size: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "Destructive",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    children: "Link Button",
    variant: "link",
  },
};

export const Success: Story = {
  args: {
    children: "Success",
    variant: "success",
    leftIcon: <Check />,
  },
};

export const Warning: Story = {
  args: {
    children: "Warning",
    variant: "warning",
  },
};

export const Info: Story = {
  args: {
    children: "Info",
    variant: "info",
  },
};

export const Subtle: Story = {
  args: {
    children: "Subtle",
    variant: "subtle",
  },
};

export const Brand: Story = {
  args: {
    children: "Brand",
    variant: "brand",
  },
};

export const WithLeftIcon: Story = {
  args: {
    children: "Email",
    leftIcon: <Mail />,
  },
};

export const WithRightIcon: Story = {
  args: {
    children: "Next",
    rightIcon: <ArrowRight />,
  },
};

export const WithBothIcons: Story = {
  args: {
    children: "Add Email",
    leftIcon: <Plus />,
    rightIcon: <Mail />,
  },
};

export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

export const ExtraLarge: Story = {
  args: {
    children: "Extra Large",
    size: "xl",
  },
};

export const Icon: Story = {
  args: {
    children: <Mail />,
    size: "icon",
    "aria-label": "Send email",
  },
};

export const IconSmall: Story = {
  args: {
    children: <Mail />,
    size: "icon-sm",
    "aria-label": "Send email",
  },
};

export const IconLarge: Story = {
  args: {
    children: <Mail />,
    size: "icon-lg",
    "aria-label": "Send email",
  },
};

export const FullWidth: Story = {
  args: {
    children: "Full Width Button",
    fullWidth: true,
  },
};

export const Loading: Story = {
  args: {
    children: "Loading",
    isLoading: true,
  },
};

export const LoadingWithText: Story = {
  args: {
    children: "Submit",
    isLoading: true,
    loadingText: "Submitting...",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const ButtonGroup: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="info">Info</Button>
      <Button variant="subtle">Subtle</Button>
      <Button variant="brand">Brand</Button>
    </div>
  ),
};

export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
};

export const IconSizeVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="icon-sm" aria-label="Small icon"><Mail /></Button>
      <Button size="icon" aria-label="Default icon"><Mail /></Button>
      <Button size="icon-lg" aria-label="Large icon"><Mail /></Button>
    </div>
  ),
};