<%
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
	String currentUrl = basePath;
	//basePath = "http://192.168.10.173:8080";
	String resoucesUrl = basePath +"/resources/js";
	
%>
<script type="text/javascript">
	var requestUrl = "<%=basePath%>";
	var serverUrl = "<%=basePath%>";
	var imgUrl = "<%=basePath%>/resources/images/";
	Date.prototype.format = function (format) {
        var date = this;
        var ymd = [
            this.digit(date.getFullYear(), 4)
            , this.digit(date.getMonth() + 1)
            , this.digit(date.getDate())
        ]
        var hms = [
            this.digit(date.getHours())
            , this.digit(date.getMinutes())
            , this.digit(date.getSeconds())
        ];
        format = format || 'yyyy-MM-dd HH:mm:ss';
        return format.replace(/yyyy/g, ymd[0])
            .replace(/MM/g, ymd[1])
            .replace(/dd/g, ymd[2])
            .replace(/HH/g, hms[0])
            .replace(/mm/g, hms[1])
            .replace(/ss/g, hms[2]);
    };

    Date.prototype.digit = function (num, length, end) {
        var str = '';
        num = String(num);
        length = length || 2;
        for (var i = num.length; i < length; i++) {
            str += '0';
        }
        return num < Math.pow(10, length) ? str + (num | 0) : num;
    };
</script>