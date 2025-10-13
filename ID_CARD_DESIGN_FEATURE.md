# ID Card Design Persistence Feature

## Overview
This feature allows schools to save their ID card designs (fields, styling, layout) and automatically reuse them for all classes within the same school. This eliminates the need to reconfigure ID card settings for each class.

## Features

### 1. Save Design
- Schools can save their current ID card design including:
  - Selected fields and their positions
  - Font sizes and styling
  - Background colors and images
  - Photo positions and sizes
  - Template selection

### 2. Auto-Load Design
- When printing ID cards for any class in a school, the system automatically loads the saved design
- No need to reconfigure settings for different classes
- Maintains consistency across all classes

### 3. Design Management
- **Save Design**: Save current configuration as the school's default design
- **Load Design**: Manually load the saved design
- **Reset**: Clear all customizations and return to default settings

## How It Works

### Database Schema
The system uses a new `IdCardDesign` model that stores:
- `schoolId`: Reference to the school
- `designName`: Name of the design
- `template`: Selected template
- `fields`: Array of field configurations with positions and sizes
- `styling`: Background, fonts, colors
- `photoSettings`: Photo position and size
- `isDefault`: Boolean indicating if this is the school's default design

### API Endpoints
- `POST /admin/save-design`: Save current design
- `GET /admin/load-design/:schoolId`: Load saved design
- `GET /admin/school-designs/:schoolId`: Get all designs for a school
- `DELETE /admin/delete-design/:designId`: Delete a design

### User Interface
The template includes new buttons in the Design Management section:
- 💾 Save Design
- 📂 Load Design  
- 🔄 Reset

## Usage Workflow

1. **First Time Setup**:
   - Select students from a class
   - Choose template and customize design
   - Add fields, adjust positions, set styling
   - Click "💾 Save Design" to save as school default

2. **Subsequent Classes**:
   - Select students from any other class in the same school
   - The saved design automatically loads
   - Print ID cards with consistent design
   - No need to reconfigure settings

3. **Design Updates**:
   - Make changes to the design
   - Click "💾 Save Design" to update the school's default
   - All future classes will use the updated design

## Benefits

- **Time Saving**: No need to reconfigure for each class
- **Consistency**: All classes use the same professional design
- **Efficiency**: Streamlined workflow for schools with multiple classes
- **Flexibility**: Schools can still customize per class if needed

## Technical Implementation

### Backend
- New `IdCardDesign` model with comprehensive schema
- Controller functions for CRUD operations
- Automatic design loading in print workflow

### Frontend
- JavaScript functions for design management
- Auto-loading of saved designs
- Real-time design application
- User-friendly interface with clear feedback

### Data Flow
1. User customizes design → Saves to database
2. User selects students from different class → System loads saved design
3. Design automatically applied → User prints ID cards
4. Consistent design across all classes

## Error Handling
- Graceful fallback if no saved design exists
- Clear error messages for failed operations
- Automatic retry mechanisms for network issues
- Validation of design data before saving

This feature significantly improves the user experience for schools with multiple classes, ensuring professional and consistent ID card designs across all students. 