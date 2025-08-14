interface ServiceCardProps {
    image: string;
    title: string;
    description: string;
  }
  
  const ServiceCard = ({ image, title, description }: ServiceCardProps) => {
    return (
      <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3">
          <img 
            src={image} 
            alt={title}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default ServiceCard;