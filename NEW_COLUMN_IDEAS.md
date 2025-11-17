# New Column Ideas for Onda Planner

This document contains ideas for new column types that could enhance the Onda task management application.

## Current Column Types Analysis

Before suggesting new columns, let's understand what we have:

### Day-Based Columns (inheriting from DayBasedColumn)
- **CheckBoxColumn** - Simple boolean checkboxes for each day of the week
- **TextBoxColumn** - Free-form text input for each day
- **NumberBoxColumn** - Numeric values for each day
- **MultiSelectColumn** - Multiple tag selection for each day with customizable colors
- **MultiCheckboxColumn** - Multiple checkbox options for each day

### Non-Day-Based Columns (inheriting from BaseColumn)
- **TodoColumn** - Task list with completion status and optional categories
- **TaskTableColumn** - Task management with done/not done states and color-coded tags

---

## Suggested New Column Types

### 1. **ProgressBarColumn** (Day-Based)
**Purpose:** Visual progress tracking for daily goals or habits

**Features:**
- Displays a progress bar (0-100%) for each day
- Optional target value configuration
- Color coding based on completion percentage (e.g., red < 50%, yellow 50-80%, green > 80%)
- Display actual value vs target (e.g., "7/10 hours")

**Use Cases:**
- Sleep hours tracking
- Work hours logging
- Water intake monitoring
- Exercise duration
- Study time tracking

**Implementation Notes:**
- Extends `DayBasedColumn`
- Store value as "current/target" string format
- Add `target` property (number)
- Add `unit` property (string, e.g., "hours", "glasses", "minutes")
- Add `colorThresholds` property for custom color ranges

---

### 2. **RatingColumn** (Day-Based)
**Purpose:** Daily ratings using stars, emojis, or numeric scales

**Features:**
- Star rating (1-5 stars) or custom scale (1-10)
- Alternative display: emoji faces (😞 😐 🙂 😊 😄)
- Visual and intuitive feedback
- Quick input with single click

**Use Cases:**
- Mood tracking
- Day quality rating
- Meal quality
- Sleep quality
- Energy levels
- Productivity self-assessment

**Implementation Notes:**
- Extends `DayBasedColumn`
- Add `ratingType` property: "stars", "numeric", "emojis"
- Add `maxRating` property (default: 5)
- Add `customEmojis` property for emoji type
- Store as numeric value in days object

---

### 3. **TimeRangeColumn** (Day-Based)
**Purpose:** Track time ranges or durations for each day

**Features:**
- Start time and end time picker
- Automatic duration calculation
- Display in 12h or 24h format
- Visual timeline indicator
- Overlap detection and warnings

**Use Cases:**
- Work schedule tracking
- Sleep schedule
- Meeting times
- Focus time blocks
- Break schedules

**Implementation Notes:**
- Extends `DayBasedColumn`
- Store as JSON string: `{"start": "09:00", "end": "17:00"}`
- Add `format` property: "12h" or "24h"
- Add `showDuration` boolean property
- Add method to calculate total hours

---

### 4. **LinkColumn** (Day-Based)
**Purpose:** Store and organize URLs or file paths for each day

**Features:**
- Clickable links with custom labels
- Automatic URL validation
- Preview on hover (optional)
- Icon display based on link type (web, file, email)
- Multiple links per day support

**Use Cases:**
- Daily reference materials
- Meeting links
- Documentation links
- File locations
- Resource tracking

**Implementation Notes:**
- Extends `DayBasedColumn`
- Store as JSON array: `[{"url": "...", "label": "..."}]`
- Add `maxLinks` property
- Add `openInBrowser` boolean property
- Validate URLs on input

---

### 5. **ColorPickerColumn** (Day-Based)
**Purpose:** Assign colors to days for visual categorization

**Features:**
- Color palette selector
- Hex code input option
- Visual day coloring in the planner
- Preset color schemes
- Transparency/opacity control

**Use Cases:**
- Priority coding
- Category visualization
- Status indicators
- Theme planning
- Visual day grouping

**Implementation Notes:**
- Extends `DayBasedColumn`
- Store color as hex string in days
- Add `colorPalette` property: array of preset colors
- Add `allowCustom` boolean for custom hex input

---

### 6. **CurrencyColumn** (Day-Based)
**Purpose:** Track monetary values with proper currency formatting

**Features:**
- Currency symbol configuration ($/€/£/¥, etc.)
- Automatic number formatting with thousands separators
- Decimal places configuration
- Sum calculation for the week
- Income/expense toggle (positive/negative)
- Color coding for income (green) vs expense (red)

**Use Cases:**
- Daily expense tracking
- Income logging
- Budget monitoring
- Sales tracking
- Financial goals

**Implementation Notes:**
- Extends `DayBasedColumn`
- Store as numeric value
- Add `currency` property (default: "$")
- Add `decimalPlaces` property (default: 2)
- Add `type` property: "expense" or "income"
- Add method to calculate weekly total

---

### 7. **FileAttachmentColumn** (Day-Based)
**Purpose:** Attach and manage files for each day

**Features:**
- File upload/attachment support
- Multiple file types (images, PDFs, documents)
- File preview for images
- File name display with icon
- File size display
- Click to open file

**Use Cases:**
- Daily reports attachment
- Photo logging
- Document tracking
- Receipt management
- Screenshot archiving

**Implementation Notes:**
- Extends `DayBasedColumn`
- Store file paths as JSON array
- Add `maxFiles` property
- Add `allowedTypes` property: array of file extensions
- Integrate with Electron's file system APIs

---

### 8. **FormulaColumn** (Day-Based)
**Purpose:** Calculate values based on other columns

**Features:**
- Simple formula syntax (e.g., "=A+B", "=A*2")
- Reference other columns by name or ID
- Basic operations: +, -, *, /, average, sum
- Auto-update when referenced columns change
- Display calculated result

**Use Cases:**
- Calculate total hours from multiple time entries
- Compute averages
- Calculate percentages
- Sum multiple number columns
- Complex productivity metrics

**Implementation Notes:**
- Extends `DayBasedColumn`
- Add `formula` property (string)
- Add `referencedColumns` array
- Parse and evaluate formula safely
- Update on dependency changes

---

### 9. **HabitStreakColumn** (Non-Day-Based)
**Purpose:** Track habit streaks and consistency

**Features:**
- Current streak display
- Longest streak record
- Success rate percentage
- Visual streak calendar
- Streak milestone celebrations
- Reset functionality

**Use Cases:**
- Habit formation tracking
- Consistency monitoring
- Daily routine maintenance
- Goal achievement tracking

**Implementation Notes:**
- Extends `BaseColumn`
- Store history as date array
- Add `currentStreak` property (number)
- Add `longestStreak` property (number)
- Add `successRate` property (percentage)
- Add method to mark day complete/incomplete

---

### 10. **MarkdownNotesColumn** (Non-Day-Based)
**Purpose:** Rich text notes with markdown support

**Features:**
- Full markdown formatting support
- Preview and edit modes
- Syntax highlighting for code blocks
- Checklist support within notes
- Search within notes
- Export to markdown file

**Use Cases:**
- Detailed notes and documentation
- Meeting notes
- Project planning
- Journal entries
- Code snippets

**Implementation Notes:**
- Extends `BaseColumn`
- Store markdown text as string
- Add `content` property
- Integrate markdown parser/renderer
- Add `showPreview` boolean property

---

### 11. **WeatherColumn** (Day-Based)
**Purpose:** Track or plan based on weather conditions

**Features:**
- Manual weather entry (sunny, cloudy, rainy, etc.)
- Temperature input
- Weather icon display
- Optional API integration for auto-fill
- Historical weather data

**Use Cases:**
- Outdoor activity planning
- Mood correlation with weather
- Clothing planning
- Travel planning

**Implementation Notes:**
- Extends `DayBasedColumn`
- Store as JSON: `{"condition": "sunny", "temp": 72, "unit": "F"}`
- Add `conditions` array with icons
- Add `temperatureUnit` property: "C" or "F"
- Optional weather API integration

---

### 12. **PriorityColumn** (Day-Based)
**Purpose:** Visual priority indicators for each day

**Features:**
- Priority levels: Low, Medium, High, Urgent
- Color coding (green, yellow, orange, red)
- Custom priority names and colors
- Icon indicators
- Sort/filter by priority

**Use Cases:**
- Task prioritization
- Urgency tracking
- Focus area identification
- Workload balancing

**Implementation Notes:**
- Extends `DayBasedColumn`
- Store priority level as string
- Add `priorities` array: custom priority levels
- Add `priorityColors` object: mapping priorities to colors
- Add `priorityIcons` object: mapping priorities to icons

---

### 13. **CounterColumn** (Day-Based)
**Purpose:** Simple increment/decrement counter for daily tracking

**Features:**
- Plus/minus buttons for quick counting
- Display current count
- Optional min/max limits
- Reset option
- Weekly total display

**Use Cases:**
- Coffee cups consumed
- Interruptions tracking
- Push-ups completed
- Pages read
- Calls made
- Any countable activity

**Implementation Notes:**
- Extends `DayBasedColumn`
- Store as numeric value
- Add `minValue` property (default: 0)
- Add `maxValue` property (optional)
- Add increment/decrement methods

---

### 14. **DurationColumn** (Day-Based)
**Purpose:** Track time durations in hours:minutes format

**Features:**
- Time duration input (HH:MM format)
- Visual time bar
- Weekly total calculation
- Convert to decimal hours option
- Overtime/undertime indicators

**Use Cases:**
- Work hours tracking
- Exercise duration
- Study time
- Project time logging
- Activity duration tracking

**Implementation Notes:**
- Extends `DayBasedColumn`
- Store as minutes (integer)
- Add `displayFormat` property: "HH:MM" or "decimal"
- Add `targetDuration` property for comparison
- Add method to calculate weekly total

---

### 15. **ImageColumn** (Day-Based)
**Purpose:** Visual daily journaling with images

**Features:**
- Single image per day
- Image upload or camera capture
- Thumbnail display in cell
- Click to enlarge
- Caption support
- Image filters/editing (optional)

**Use Cases:**
- Photo diary
- Progress photos (fitness, projects)
- Daily outfit tracking
- Meal logging
- Visual memories

**Implementation Notes:**
- Extends `DayBasedColumn`
- Store image path/data
- Add `caption` support
- Image compression for storage
- Integrate with Electron file system

---

## Priority Implementation Recommendations

Based on versatility and user value, here are the recommended priorities:

### High Priority (Most Useful)
1. **ProgressBarColumn** - Highly visual, versatile for many use cases
2. **RatingColumn** - Simple, intuitive, great for tracking subjective metrics
3. **CurrencyColumn** - Essential for financial tracking, commonly requested feature
4. **CounterColumn** - Simple but powerful for habit tracking

### Medium Priority (Nice to Have)
5. **TimeRangeColumn** - Professional users will appreciate this
6. **PriorityColumn** - Helps with task management
7. **DurationColumn** - Professional time tracking
8. **HabitStreakColumn** - Gamification element for motivation

### Lower Priority (Advanced Features)
9. **FormulaColumn** - Power user feature, more complex to implement
10. **LinkColumn** - Useful but less frequently needed
11. **MarkdownNotesColumn** - Rich feature, but overlaps with notes functionality
12. **FileAttachmentColumn** - Useful but requires careful storage management

### Optional/Future Enhancements
13. **ColorPickerColumn** - More aesthetic than functional
14. **WeatherColumn** - Niche use case
15. **ImageColumn** - Storage-intensive, needs careful implementation

---

## Implementation Architecture Notes

All new columns should follow these patterns:

### Day-Based Columns
```typescript
import { DayBasedColumn, Day } from './DayBasedColumn';

export class NewColumn extends DayBasedColumn {
    // Add specific properties
    
    constructor(emojiIcon, width, nameVisible, name, description, id) {
        super('column-type', emojiIcon, width, nameVisible, name, description, id);
        // Initialize specific properties
    }
    
    static fromJSON(json: Record<string, any>): NewColumn {
        // Deserialize from JSON
    }
    
    toJSON(): Record<string, any> {
        return {
            ...super.toJSON(),
            // Add specific properties
        };
    }
    
    // Add specific methods
}
```

### Non-Day-Based Columns
```typescript
import { BaseColumn } from './BaseColumn';

export class NewColumn extends BaseColumn {
    // Add specific properties
    
    constructor(emojiIcon, width, nameVisible, name, description, id) {
        super('column-type', emojiIcon, width, nameVisible, name, description, id);
        // Initialize specific properties
    }
    
    static fromJSON(json: Record<string, any>): NewColumn {
        // Deserialize from JSON
    }
    
    toJSON(): Record<string, any> {
        return {
            ...super.toJSON(),
            // Add specific properties
        };
    }
    
    // Add specific methods
}
```

### Integration Checklist for Each New Column

1. Create the column class file in `render/src/models/columns/`
2. Add export to `render/src/models/columns/index.ts`
3. Add case to `ColumnFactory` function
4. Add case to `createColumn` function
5. Create corresponding UI component for the column
6. Add icon/emoji to icon registry
7. Update any type definitions
8. Add to column type selection menu
9. Test serialization/deserialization
10. Add to documentation

---

## Conclusion

These 15 new column ideas provide a comprehensive set of enhancements that would significantly expand Onda's capabilities as a task management and planning tool. Each column type is designed to address specific user needs while maintaining consistency with the existing architecture.

The implementation should be prioritized based on user demand and development resources, starting with the high-priority columns that offer the most value to the broadest user base.
