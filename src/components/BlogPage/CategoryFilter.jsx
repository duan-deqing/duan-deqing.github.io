/**
 * ============================================================================
 *  CategoryFilter.jsx - 分类筛选组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 显示文章分类标签
 * 2. 支持点击筛选功能
 * 3. 当前选中分类高亮显示
 * 4. 响应式布局
 *
 * 【Props】
 * - categories: array - 分类列表
 * - activeCategory: string - 当前选中的分类
 * - onCategoryChange: function - 分类切换回调函数
 * - t: function - 翻译函数
 * ============================================================================
 */

export default function CategoryFilter({ categories, activeCategory, onCategoryChange, t }) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeCategory === category.id
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {t(category.label)}
        </button>
      ))}
    </div>
  )
}