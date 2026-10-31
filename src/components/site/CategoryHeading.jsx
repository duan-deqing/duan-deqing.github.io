export default function CategoryHeading({ id, label, index = 0 }) {
  return (
    <div className="category-head">
      <h2
        id={id}
        className="category-title"
        style={{ '--category-index': index }}
      >
        {label}
      </h2>
    </div>
  )
}
