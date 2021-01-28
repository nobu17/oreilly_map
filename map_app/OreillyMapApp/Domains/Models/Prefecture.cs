using System;
using System.ComponentModel;
using System.Reflection;

namespace Domains.Models
{
    public enum Prefecture
    {
        [Description("北海道")]
        Hokkaido,
        [Description("青森県")]
        Aomori,
        [Description("岩手県")]
        Iwate,
        [Description("宮城県")]
        Miyagi,
        [Description("秋田県")]
        Akita,
        [Description("山形県")]
        Yamagata,
        [Description("福島県")]
        Fukushima,
        [Description("茨城県")]
        Ibaraki,
        [Description("栃木県")]
        Tochigi,
        [Description("群馬県")]
        Gunma,
        [Description("埼玉県")]
        Saitama,
        [Description("千葉県")]
        Chiba,
        [Description("東京都")]
        Tokyo,
        [Description("神奈川県")]
        Kanagawa,
        [Description("新潟県")]
        Nigata,
        [Description("富山県")]
        Toyama,
        [Description("石川県")]
        Ishikawa,
        [Description("福井県")]
        Fukui,
        [Description("山梨県")]
        Yamanashi,
        [Description("長野県")]
        Nagano,
        [Description("岐阜県")]
        Gifu,
        [Description("静岡県")]
        Shizuoka,
        [Description("愛知県")]
        Aichi,
        [Description("三重県")]
        Mie,
        [Description("滋賀県")]
        Shiga,
        [Description("京都府")]
        Kyoto,
        [Description("大阪府")]
        Osaka,
        [Description("兵庫県")]
        Hyogo,
        [Description("奈良県")]
        Nara,
        [Description("和歌山県")]
        Wakayama,
        [Description("鳥取県")]
        Tottori,
        [Description("島根県")]
        Shimane,
        [Description("岡山県")]
        Okayama,
        [Description("広島県")]
        Hiroshima,
        [Description("山口県")]
        Yamaguchi,
        [Description("徳島県")]
        Tokushima,
        [Description("香川県")]
        Kagawa,
        [Description("愛媛県")]
        Ehime,
        [Description("高知県")]
        Kouchi,
        [Description("福岡県")]
        Fukuoka,
        [Description("佐賀県")]
        Saga,
        [Description("長崎県")]
        Nagasaki,
        [Description("熊本県")]
        Kumamoto,
        [Description("大分県")]
        Oita,
        [Description("宮崎県")]
        Miyazaki,
        [Description("鹿児島県")]
        Kagoshima,
        [Description("沖縄県")]
        Okinawa
    }


    public static class PrefectureExtension
    {
        public static string GetEnumDescription(this Prefecture value)
        {
            string description = string.Empty;

            try
            {
                string strValue = value.ToString();
                if (0 < strValue.Length)
                {
                    FieldInfo fi = value.GetType().GetField(strValue);
                    Attribute attr = Attribute.GetCustomAttribute(fi, typeof(DescriptionAttribute));
                    if (attr != null)
                    {
                        DescriptionAttribute descAttr = (DescriptionAttribute)attr;
                        description = descAttr.Description;
                    }
                }
            }
            catch
            {
                description = value.ToString();
            }

            return description;
        }
    }
}
