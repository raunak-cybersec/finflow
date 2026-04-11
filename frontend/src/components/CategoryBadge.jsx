import { CATEGORIES } from '../utils/helpers';

const CategoryBadge = ({ category, size = 'sm' }) => {
  const cat = CATEGORIES[category] || CATEGORIES['Other'];
  const padding = size === 'sm' ? '3px 10px' : '5px 14px';
  const fontSize = size === 'sm' ? 12 : 13;

  return (
    <span
      className="badge"
      style={{
        background: cat.bg,
        color: cat.color,
        border: `1px solid ${cat.border}`,
        padding,
        fontSize,
      }}
    >
      <span>{cat.icon}</span>
      <span>{category}</span>
    </span>
  );
};

export default CategoryBadge;
