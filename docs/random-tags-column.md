# Random Tags Column

## Overview

The Random Tags Column automatically assigns tags to each day of the week based on configured probability values.

## Features

### 1. Probability-Based Tag Assignment

- Each tag has a probability value (0-100%)
- Tags are assigned independently based on their probability
- Multiple tags can be assigned to the same day
- Higher probability = more likely to appear

### 2. Regenerate Tags

- Hover over any cell to see the shuffle button
- Click the shuffle icon to regenerate random tags for that day
- New tags are selected based on the configured probabilities

### 3. Configure Tags

- Add new tags with default 50% probability
- Edit tag names and colors
- Edit probability values (0-100%)
- Remove tags as needed

## Usage

### Creating a Random Tags Column

1. Click "Add Column" in the table
2. Select "Random Tags" from the column types
3. The column comes with 3 default tags:
    - High (30% probability)
    - Medium (50% probability)
    - Low (20% probability)

### Managing Tags

1. Click the column header to open the column menu
2. Under "Tags (with Probability)":
    - Add new tags in the input field
    - Click existing tags to:
        - Change the color
        - Edit the name
        - Edit the probability (%)
        - Delete the tag

### Regenerating Random Tags

1. Hover over any day cell in the column
2. Click the shuffle icon that appears
3. New tags will be randomly assigned based on probabilities

## Technical Details

### Probability Algorithm

Each tag is evaluated independently using `Math.random()`:

- If `random() * 100 < tag.probability`, the tag is selected
- This means a tag with 30% probability has a 30% chance to appear
- Multiple tags can be selected for the same day
- It's also possible for no tags to be selected if probabilities are low

### Data Structure

```typescript
interface TagWithProbability {
    id: string;
    name: string;
    color: string;
    probability: number; // 0-100
}
```

## Examples

### Use Case 1: Priority Levels

- High Priority: 20%
- Medium Priority: 50%
- Low Priority: 30%

### Use Case 2: Mood Tracker

- Energetic: 40%
- Calm: 40%
- Tired: 20%

### Use Case 3: Activity Types

- Exercise: 30%
- Study: 50%
- Social: 25%
- Rest: 40%

## Notes

- Probabilities don't need to sum to 100%
- Tags are assigned independently
- A day can have zero, one, or multiple tags
