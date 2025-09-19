# Messages System Components

This directory contains the UI components for the vendor dashboard messages system.

## Components

### MessagesPage (`app/vendor/messages/page.tsx`)
The main messages interface featuring:
- **Left Sidebar**: Conversation list with search and filtering
- **Right Panel**: Active chat window with message bubbles
- **Real-time Features**: Online status indicators, typing indicators
- **Attachment Support**: File uploads, media sharing, invoice generation

### MediaModal (`components/ui/modals/MediaModal.tsx`)
Modal for browsing and selecting media files:
- **Tabs**: Photos & Videos, Links, Documents
- **Chronological Organization**: Media grouped by month
- **File Types**: Support for images, videos, PDFs, Word docs, Excel files
- **Preview**: Thumbnail previews with file metadata

### InvoiceModal (`components/ui/modals/InvoiceModal.tsx`)
Invoice creation and management:
- **Dynamic Items**: Add/remove invoice line items
- **Client Selection**: Dropdown with existing clients
- **Calculations**: Automatic subtotal, discount, and total calculations
- **Actions**: Preview receipt and save & send functionality

### AttachmentDropdown (`components/ui/AttachmentDropdown.tsx`)
Dropdown menu for message attachments:
- **Schedule Meeting**: Meeting scheduling functionality
- **Documents**: File attachment options
- **Media**: Pictures and videos sharing
- **Invoice Generation**: Quick invoice creation

### PlaceholderImage (`components/ui/PlaceholderImage.tsx`)
Utility component for placeholder images:
- **Responsive**: Supports both number and string dimensions
- **Customizable**: Configurable size, styling, and alt text
- **Consistent**: Uniform placeholder appearance across the app

## Features

### Message Interface
- ✅ Conversation list with search and filtering
- ✅ Real-time chat with message bubbles
- ✅ Online status indicators
- ✅ Message input with emoji and attachment support
- ✅ File attachment dropdown menu

### Media Management
- ✅ Tabbed interface for different media types
- ✅ Chronological organization by month
- ✅ Thumbnail previews with metadata
- ✅ Support for photos, videos, links, and documents

### Invoice Generation
- ✅ Dynamic invoice item management
- ✅ Client selection dropdown
- ✅ Automatic calculations (subtotal, discount, total)
- ✅ Preview and send functionality

### Responsive Design
- ✅ Mobile-friendly layout
- ✅ Adaptive sidebar and chat panels
- ✅ Touch-friendly interface elements

## Usage

The messages system integrates seamlessly with the vendor dashboard sidebar navigation. Users can:

1. **Navigate** to `/vendor/messages` to access the messages interface
2. **Search** conversations using the search bar
3. **Filter** by All, Unread, or Archived conversations
4. **Select** conversations to view chat history
5. **Send** messages with text, emojis, and attachments
6. **Attach** files, media, or generate invoices
7. **Browse** media files in organized tabs
8. **Create** invoices with dynamic line items

## Integration

The messages system uses the existing vendor dashboard layout and styling:
- **Consistent Colors**: Uses `event-blue` (#032D71) theme
- **Shared Components**: Leverages existing UI components
- **Responsive Design**: Follows established mobile-first patterns
- **Navigation**: Integrates with vendor sidebar navigation
