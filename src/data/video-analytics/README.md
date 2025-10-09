# Video Analytics Data

Thư mục này chứa dữ liệu và utilities cho tính năng Video Analytics.

## 📁 Cấu trúc thư mục

```
src/data/video-analytics/
├── videoData.json          # File JSON chứa dữ liệu video (paste data vào đây)
├── index.ts               # Utilities và helper functions
└── README.md              # File này
```

## 📊 Cách sử dụng

### 1. Thêm dữ liệu JSON
- Mở file `videoData.json`
- Paste dữ liệu JSON của bạn vào phần `data` array
- Cập nhật `metadata` nếu cần

### 2. Import và sử dụng trong component
```typescript
import { 
  getVideoData, 
  calculateVideoMetrics, 
  formatCurrency,
  formatPercentage 
} from '../data/video-analytics';

// Lấy dữ liệu
const videoData = getVideoData();

// Tính toán metrics
const metrics = calculateVideoMetrics(videoData);

// Format hiển thị
const formattedCost = formatCurrency(metrics.totalCost);
const formattedCTR = formatPercentage(metrics.avgCTR);
```

## 🔧 Available Functions

### Data Functions
- `getVideoData()` - Lấy array dữ liệu video
- `getVideoMetadata()` - Lấy metadata
- `calculateVideoMetrics(data)` - Tính toán metrics tổng hợp

### Filter Functions
- `filterVideosByStatus(data, status)` - Lọc theo trạng thái
- `getTopPerformingVideos(data, limit)` - Lấy video hiệu suất cao nhất
- `getVideosByCreator(data, creatorName)` - Lọc theo creator

### Format Functions
- `formatCurrency(amount)` - Format tiền tệ VN
- `formatPercentage(value)` - Format phần trăm
- `formatNumber(num)` - Format số

### Badge Functions
- `getDeliveryStatusInfo(status)` - Thông tin badge trạng thái
- `getContentTypeInfo(type)` - Thông tin badge loại content
- `getTopTenPercentInfo(isTopTen)` - Thông tin badge top 10%

## 📋 Data Structure

### VideoAnalyticsData Interface
```typescript
interface VideoAnalyticsData {
  tt_account_name: string;                    // Tên TikTok account
  tt_account_avatar_icon: string;            // Avatar URL
  item_id: string;                           // Video ID
  material_name: string;                      // Tên video
  shop_content_type: string;                 // Loại content
  material_video_info_poster_url: string;    // Thumbnail URL
  material_video_info_video_id: string;      // Video ID
  material_video_info_play_url: string;      // Play URL
  item_delivery_status: string;              // Trạng thái (3=Active, 4=Paused, 0=Inactive)
  is_gmv_top_ten_percent: string;            // Top 10% (1=Yes, 0=No)
  onsite_roi2_shopping_sku: string;          // SKU count
  onsite_roi2_shopping_value: string;        // Revenue
  onsite_shopping_sku_cvr: string;           // Conversion rate
  play_2s_rate: string;                      // 2s play rate %
  play_6s_rate: string;                      // 6s play rate %
  play_first_quartile_rate: string;          // 25% completion %
  play_midpoint_rate: string;                // 50% completion %
  play_third_quartile_rate: string;          // 75% completion %
  play_over_rate: string;                    // 100% completion %
  mixed_real_cost: string;                   // Total cost
  mixed_real_cost_per_onsite_roi2_shopping_sku: string; // Cost per SKU
  onsite_mixed_real_roi2_shopping: string;   // ROI
  roi2_show_cnt: string;                     // Show count (views)
  roi2_click_cnt: string;                    // Click count
  roi2_ctr: string;                          // CTR %
}
```

## 🚀 Ví dụ sử dụng

### Trong CampaignVideoDetail component
```typescript
import { getVideoData, calculateVideoMetrics } from '../data/video-analytics';

const CampaignVideoDetail = () => {
  const videoData = getVideoData();
  const metrics = calculateVideoMetrics(videoData);
  
  return (
    <div>
      <h2>Tổng Views: {metrics.totalViews}</h2>
      <h2>Tổng Clicks: {metrics.totalClicks}</h2>
      <h2>Tổng Cost: {formatCurrency(metrics.totalCost)}</h2>
      <h2>ROI Trung bình: {metrics.avgROI.toFixed(2)}</h2>
    </div>
  );
};
```

## 📝 Lưu ý

1. **Dữ liệu JSON**: Paste dữ liệu vào `videoData.json` trong phần `data` array
2. **Type Safety**: Sử dụng TypeScript interfaces để đảm bảo type safety
3. **Performance**: Dữ liệu được cache trong memory, không cần fetch lại
4. **Extensibility**: Có thể thêm functions mới vào `index.ts` khi cần

## 🔄 Cập nhật dữ liệu

1. Mở `videoData.json`
2. Thay thế phần `data` array bằng dữ liệu mới
3. Cập nhật `lastUpdated` timestamp
4. Cập nhật `metadata.totalVideos` nếu cần
5. Save file - dữ liệu sẽ tự động được load trong app

