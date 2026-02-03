import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export interface PDFGenerationOptions {
  scale?: number
  useCORS?: boolean
  backgroundColor?: string
  quality?: number
}

export const generateReceiptPDF = async (
  element: HTMLElement,
  filename: string = 'receipt.pdf',
  options: PDFGenerationOptions = {}
): Promise<void> => {
  const {
    scale = 3, // Higher scale for pixel-perfect quality
    useCORS = true,
    backgroundColor = '#ffffff',
    quality = 1.0
  } = options

  try {
    // Create a temporary container with exact dimensions for PDF
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '0'
    tempContainer.style.width = '794px' // A4 width in pixels (210mm at 96 DPI)
    tempContainer.style.backgroundColor = backgroundColor
    tempContainer.style.padding = '0'
    tempContainer.style.margin = '0'
    tempContainer.style.fontFamily = 'Arial, sans-serif'
    tempContainer.style.lineHeight = '1.4'
    
    // Clone the element and append to temp container
    const clonedElement = element.cloneNode(true) as HTMLElement
    clonedElement.style.width = '100%'
    clonedElement.style.margin = '0'
    clonedElement.style.padding = '0'
    
    tempContainer.appendChild(clonedElement)
    document.body.appendChild(tempContainer)

    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate high-quality canvas
    const canvas = await html2canvas(tempContainer, {
      scale: scale,
      useCORS: useCORS,
      backgroundColor: backgroundColor,
      allowTaint: true,
      foreignObjectRendering: true,
      logging: false,
      width: 794,
      height: tempContainer.scrollHeight
    })

    // Create PDF with exact dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    })

    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Convert canvas to high-quality image
    const imgData = canvas.toDataURL('image/png', quality)

    // Add image to PDF with proper positioning
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST')

    // Handle multi-page if needed
    let heightLeft = imgHeight
    let position = 0

    while (heightLeft >= pageHeight) {
      position = heightLeft - pageHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pageHeight
    }

    // Download the PDF
    pdf.save(filename)

    // Cleanup
    if (tempContainer.parentNode) {
      tempContainer.parentNode.removeChild(tempContainer)
    }
    
    console.log('✅ PDF generated successfully:', filename)
  } catch (error) {
    console.error('❌ Failed to generate PDF:', error)
    throw new Error('Failed to generate PDF. Please try again.')
  }
}

export const generateReceiptPNG = async (
  element: HTMLElement,
  filename: string = 'receipt.png',
  options: PDFGenerationOptions = {}
): Promise<void> => {
  const {
    scale = 3,
    useCORS = true,
    backgroundColor = '#ffffff',
    quality = 1.0
  } = options

  try {
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: useCORS,
      backgroundColor: backgroundColor,
      allowTaint: true,
      foreignObjectRendering: true,
      logging: false
    })

    // Create download link
    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png', quality)
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    if (link.parentNode) {
      link.parentNode.removeChild(link)
    }
    
    console.log('✅ PNG generated successfully:', filename)
  } catch (error) {
    console.error('❌ Failed to generate PNG:', error)
    throw new Error('Failed to generate PNG. Please try again.')
  }
}
