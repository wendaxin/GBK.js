/*!
 * gbk.js v0.1.1
 * Homepage undefined
 * License MIT
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//用二分法的形式 搜索;
(function (name, factory) {
	if (typeof define === 'function' && (define.amd || define.cmd)) {
		define([], factory);
	} else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		global[name] = factory();
	} else {
		throw new Error("加载 " + name + " 模块失败！，请检查您的环境！")
	}
}('GBK', function () {
	// 多进制转换后的数字还原函数
	var Fn_Hex_decode = function decode(){
			var n = 0, str = arguments[0];
			for (var i = 0,w = str.length; i < w; i++) {
				var code = str.charCodeAt(i);
				if(code < 63 || code > 126) return NaN;
				n += (code - 63) * Math.pow(64, w - i - 1);
			}
			return n;
		};
	// 解压Unicode编码字符串函数
	var Fn_unzip = function unZip() {
		return arguments[0].replace	(/\#(\d+)\$/g, function (a, b) {
				return Array(+b + 4).join('#');
			})
			.replace(/\#/g, '###')
			.replace(/([\x3f-\x7e]{2})\+([\x3f-\x7e\#]+)(?:\,|$)/g, function (all, hd, dt) {
				return dt.replace(/./g, function (a) {
					if (a != '#') {
						return hd + a;
					} else {
						return a;
					}
				});
			})
			.match(/.../g);
	};

	var GBK = function () {

		/**
		 * 生成按GBk编码顺数排列的编码映射数组
		 */
		function getSortGBK(gbk) {
			var data = []
			for (var i = 0x81, k = 0; i <= 0xfe; i++) {
				for (var j = 0x40; j <= 0xfe; j++) {
					if (
						(j == 0x7f) ||
						((0xa1 <= i && i <= 0xa7) && j <= 0xa0) ||
						((0xaa <= i && i <= 0xaf) && j >= 0xa1) ||
						(0xf8 <= i && j >= 0xa1)
					) {
						continue;
					}
					var hex = gbk[k++];
					var key = Fn_Hex_decode(hex);
					if (isNaN(key)) continue;
					data.push([key, i << 8 | j])
				}
			}
			return data;
		};

		// 以GBk编码顺数排列的编码映射数组
		var data_sort_gbk = getSortGBK(Fn_unzip("Cw+ACDENQV^_`behmnprtv{,Cx+?@ACEIPTVYZabcdfgijklmnqstuvwxyz{|~,Cy+?@ABCDFIOUVX[\\]binopsuvwx{|},Cz+GKNOQYZ[_aefhlmnpswxy{},C{+?ABCDEFGJKQRSTU[\\`bghklmprtvxz}~,C|+?@ACDFGHIJKQSU`aegijlmpqtvwxy|,C}+?@ADEFIKMOQRTUWXY[]^`acjlopqrsuvwxyz{|},C~+?@AEFGHJKLQRSTUXZ_acdfjkoqstuvxz{|~,D?+?@ABCDEFGHIJMOPRTUVZ\\]_abcfjnopqrstuvwxz|~,D@+?@ACDEHIJLOPQRSUVWXZ\\]^_`abcefghijlmnopqrstwxy{|,DA+@ABCEFHIJKMNOPQRSTUVWXYZ[\\]^_`aceijlmnoprstuvwx{|}~,DB+?@ABCDEFGHIJKLMOPQRSTVWXZ[\\]^_`abcdghijnopqsuvwxy{|}~,DC+?@ABCDGHIKLMNOPRSTUVWXYZ[\\]^_abcdefghijklmnopqrstuvwxyz{|},DD+AFIKMNOQRVWXZ\\]^_`bcefhinqy}~,DE+BCEFIJMNOPRSWY\\]^`befghilmswxy}~,DF+@ABDGILMOQRSTUVWXY[]^abdefghikmpqsv},DG+CDHJKNORST[]^`abdefiknpqst{},DH+CDEFGHJMNQRTVWXYZ\\^_abcegjklmoprstuvwxyz{},DI+?BCDEFHIJKLMNPQSTUVWXY[cdefmnostuvwxyz{|,DJ+?@ACDEGIKLMNPRSTVXYZ[\\]_`abdefghijklmnpqrstuvwz{|,DK+@ABCFHIJKMPQRSWZ[]^acdfghjklnopqrstuvw{|,DL+?ACEJKLOSWXZ\\dgiklquxz{|},DM+?@BFGIMNOPQRSUVXZ[]_`cfijklnopqrstvwxy{|},DN+?BCDEFMNOQRTY[\\]`afsy}~,DO+?ADFJSWXY[acdioruvy|~,DP+@ACDFHKLMNPY\\]^_`bdfhijklmnosxy}~,DQ+@BDFGHILPRVW[]^_`admoqtuvxy{},DR+BDIJUWZ_`abcjknopstuvwxz},DS+?ABCDGIJKLMQRTUVWXY[\\]^`deghjlqstuwxyz|,DT+?ADFGJKLMNPQRSVWXYZ\\]^_abghjnopqrsxy|~,DU+DEKLMOQRTUVYZ]_`abcdeghijklmnoqsuwy{~,DV+?@ABEFGIJMNOTVWXYZ]_afhlmopsuwxyz{~,DW+ABCDEFIJLOPQRSTUVXY[\\_`adeghijmnortvwy{|},DX+?@ABCDEFGHIJNOPQRTUYZ\\]^_`bdeflmnoqrstvwxy|}~,DY+?@ABCFGHIJKLOPQSTUVWXYZ[\\]^_`acdefghijklmopqrstuwxyz|}~,DZ+?@ABCDEFGHJKLMNOPQRTUWX[bdefghikmnqruvwz{,D[+?@ADFJKLMNOPQRSTUVWXYZ\\]_`acdefjpqstuvw{|~,D\\+@BCDEGHJQRSTUWXabdfkmopqstwxy|}~,D]+?@FGHILMNOPSTUVWXY[\\]^dgiknoprtuvxyz{|}~,D^+?@CDEFGHIKLOPRUVZ[]`abdefghijkmopqrtuvz{}~,D_+@BCDGHIKMNOQRSUVWYZ[\\^abdefghjklmnpqrsuvwxyz{|}~,D`+?@ABDEFGHIJMNOQRTUVXYZ[\\^_`abcefghilmnopqrstuvwxyz{|~,Da+ACEFGIJKLMNOPSTUVWZ[\\_`abcdefijklmnopqrstuvwxyz|}~,Db+?ABCEFGHIJKLMNOQRSUVWXYZ[\\]^_`abdefghilnpqstvwyz{|}~,Dc+?@BDEGHIJKMOPQRVWZ\\]_`abegkoqrtuz|}~,Dd+?BDEIKLOQRXZ[\\]^`bcefghijklmnopqtvyz{}~,De+?DHJKMNOPSTWYZ[\\^_`aefkloprstuvwy{|~,Df+?@ABCDFGHKLMNTUXZ]^_`acefhijlmnopqrstuvwy{|},Dg+?AIJLMNOQSTUVXYZ\\]`acefgijklmnortvwxyz|}~,Dh+@ABCDFGJKLMNOPQRSUVWXZ[\\]^_`bcdeghjklmnopqrwxz{|},Di+?@ABCDEFGHIJKLMNOPRSTUVWX[\\]^_`abcdefghjklmnopsuvxyz{|~,Dj+?BCDEFGIJLMNOPRTVXYZ\\]^acdfgiklmnoqrstuvwxyz{|}~,Dk+?@ABCDEFGIJKLMNOPQRSTWXYZ[\\]^_`abcdefghijklmnoprtuwxyz{|}~,Dl+@ABCDEFGHIJKLMNQU]_`fgjlmnqsuvwxz{}~,Dm+AEILMOPQSU^fghklmnpqvyz{,Dn+?@BGHIJLMNPSTUVWXYZ[_abefhijklnpqrstuv|},Do+?ABDFGJKLMOQRVXZ]^_`beghijlmnoqrtuv,Dp+BCEFKLQRSUVWYZ[\\^acfghijkloqrstuvwz{|},Dq+?BCDEFHIJMNQRT\\]^_`cdefgimnoqsuxyz{},Dr+?ABDEFGHIKLMNOPRSTUVWYZ[\\]^_abfhjkmnpqrstuvwxy{|}~,Ds+?@CDGHIJKLNOPQRTVWXY[\\^_`abdgijknopqrtuvwxyz{~,Dt+?@ABCDEGHLMNOPQRSTUVXY[]^_`abcdefgilmopqrtuvwxyz{|}~,Du+?@BCDEFGHIJKLMNOPQRSTUVWYZ[]^_`abcdefghijklmnopqrstuwxyz{|}~,Dv+?@ABCEFGHIJKMNOPQRSTUVWXY[^_bciklotuwxyz{~,Dw+?CFHIJLMQRV]^_`abcdghijknoqrstuxy}~,Dx+?@BEFGHIJLMNOPQRUVWXY[\\^_bcdefghijklmnoptvx},Dy+@ABDGHKLMQWZ\\`abcghijkmnopqsyz{|~,Dz+?@ABCDEFGJKLMNOSTVWXY[\\]^_`abcdefhjklmnopqrtwxz{|,D{+DEFHKLMOQSUXY[\\]`abcgjkmoqrstuvwz|}~,D|+@ABCDEFGHIJKLMNPSXYZ[]^_bdfgjmnqstuwy|}~,D}+BELMNPRSUYZ\\]^_abcdefhjknopqrsuwxyz}~,D~+?@AFGIJMRSTYZ[]^abdeghknoqrsuvxy{,E?+FGHJKOPRVWY]^abcklmopqrsuvwxy|},E@+?CDEFGHIKMNPRSUVWZ[]^_`dempqstv},EA+?@ADEFGIJMNOPRTVWX[]`acdfhimortuvxy|}~,EB+?@ABCFGHKLMNOQRSUVXZ]`abcdipqtvwz{|}~,EC+ABCDFIJKOPQRSUVWXZ[\\]`adghiklmnopqrstuvwxyz{|},ED+?@ABCDEFHJLNOQRSUVWXYZ[]^_`bcdehijklmnpqrsuwxyz{|}~,EE+?@ABCDEFGHIKLNOPQRTUVWXYZ[]^_`abcdeijlmnopqrstuwxyz{|~,EF+?@BCDEFHKLMNORTUVWXYZ[\\]^_`abcdfghijklmnopqrsuvwxyz{|},EG+?@ABCDFHRSX[\\]_befghjlnopqtuwxyz{,EH+ACDEINOTUVXY[\\]^_`acdgpqstvwyz|,EI+@ABDEFGJKLMNOSX[\\]befhilmnoqrsuvwy},EJ+?@BJNPT\\]_`cijoqtwxyz,EK+?BCDEIJKLNOQRSTVWX[efhklmoprstuvwz{}~,EL+?@CFGIPQRSUVWXYZ[\\_cdegijknoqrstwx{|}~,EM+@BCDEJLPRSTVXYZ[\\]^`cejnpqtuxz|~,EN+?@ABDFGIJKPRSTVWXYZ[\\^acdefgjkmnoprtvxyz{},EO+BCEFGHILMPQTUVWXY\\^abcdfghjmnopqrtuvwxz{},EP+?ABHJKLMNOPRTUVXYZ[\\^_`abcdegijkmnopqrstuvz{|}~,EQ+?@BEGHIJKLMNORSVWYZ[\\^_`abdefgijnpqrsuxz|}~,ER+@BCEFGHIJKNPRSTUXYZ[\\^_`bdfghijklmnopqrstuvwxyz{|}~,ES+@ABCDEFGIJKLMNOPRSTUVXYZ[\\]^_`abcefghiklopqrvy{|,ET+?@ABCEFIJLMOQRSVWY[^_`cdfghilmnprtuwxyz{|}~,EU+?@ABCDEGHILMNQSTUWY\\]_abegikmpqrstuvwyz}~,EV+?AFGHILOPRSTWXYZ[\\]^`bcijqrstwxz{|}~,EW+@CDFGHJLOPQUVWYZ[]`abcehijkmoqrvwxyz|~,EX+?ACDEFGHILMOPWXZ[\\]_abdfhijklpqrtwxz{|~,EY+?@BDEGHIJLMNOQRSTWXYZ[]^_`abcdehijklnopqrtuvwyz{|~,EZ+?@ABCDEFGHIJKLMNOPQRSTUVWY]^_`abcdfgijklmnptuwyz|,E[+@ABCDEFKMNPQRUWXY[]_`abcdfhmoqruvwxz{}~,E\\+@CDFIJLQSTVWXYZ\\abcefjkmpsuwxyz|,E]+?ABDEGIKLMNPQRSUXZ^_`cehkmpqsxyz{|}~,E^+?ADEFGHIJKLMTUVZ^`bcefgijlmqtuvwxyz{},E_+@ABCELOQSTWXYZ[]^_abcdefgjklmnopstuyz~,E`+FJLNQUVWXYZ[\\]^iklmnopqrtwxyz{|}~,Ea+?ACFGHIJKLMOPQSTUWXYZ[\\]^_`bcdhijkmpqsuvwxyz{|}~,Eb+@BCDEFGIKMNOPRSUVXZ[\\]^`acdefghijklnqrsuvwz|}~,Ec+?ABCEFGHIKNPRSTUVWXYZ[\\]`abdefghijkmnpqrtuvwyz{},Ed+?@BCDEFGHIJKLMNOPQRTUWXZ[^`acdfghiklnoqrstuyz|}~,Ee+@BDIJKMNOPQRUVXY\\]^_`abcdehikmnoqrtuwxy{|}~,Ef+?ABCDEFGHJLNPQRTUVWXY[\\]`abcdefghijkmnoprstuvwxyz{},Eg+?@ABCDEFGHJKLMNOPQRSTUXYZ[\\]_abcdefhjklmoqrsuvwxyz{~,Eh+?@ABDEGHIJKLMNPQRSTUVY[\\]^_abcefghijklmnoqrstuvwyz|}~,Ei+@ABDEFGHIJKLNQRSTUWXYZ[\\]^`abcdefgilmnopqrstuvwxyz{|}~,Ej+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,Ek+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^deghijklmnoprstuwz{|~,El+?@ACDGIJLMNOPQRSTUVWYZ[\\]^_`ghjklmnopqrstuvwy|}~,Em+?DGKMNOPSTVWX[\\]^_abcdefghjklmnopquwxyz{|},En+?BCEFGHIKMOPWY[\\]^_abcdefghklmopqsuvwyz{}~,Eo+?@ABCGHIJKMQV[\\]_bdjklpruvxyz{}~,Ep+BCDGJKLMNPQRUWXYabdefjklmnprtvwyz{~,Eq+?CFIJLMPQTUVWY[\\]_agknostuvy,Er+?@ABEFGJLMNPQWXY[\\^cefhklqsx~,Es+?ABDEGHILNOPRSTUW[\\^_`abceghklnosuvwy~,Et+?ACHKOTUVWZ\\^`acdfgjklopqrtuxyz|}~,Eu+?@BCEFIJLNOQUVWXY[adkloprsuvxyz{|},Ev+@ABGHILMNOQRSTVYZ[^abdfghilnoqstuwy|}~,Ew+?@ABCEFGHJNQRTWXZ[]^aefgikmoprtuvxz{|}~,Ex+?@ADEFGHIJKNOPQTVXY[\\]_`abcdefghiklnopqrstuvwxyz{|,Ey+?@ACFGIJKLMPQRSTUVXYZ\\]_`bceghjklmortwx{}~,Ez+?BCDEGHIKLMOQUWXZ[\\bfijklmnopqrtuvwyz{|}~,E{+?@BCDFGIJKLMOPQUVWXYZ[\\]^`abdefgkmoqstvwxyz{|~,E|+?@ABCDGHIKMNOPQRSTUVXYZ\\^_`bcdfghijknoprtuvxz|}~,E}+?@ABDEFIJNOPQRSTUVWXYZ\\]^_abcdeghijklmnopqstvwyz{|}~,E~+@BCDEFGIJKLMNORSTUVWXYZ[\\^abcdefghijklopqrstuvwxyz{|}~,F?+?@ABCDEFGHIJKLMNOQRSTUVWX[\\]^_`acdefghijklmnopqrsuvwyz{|}~,F@+?@ABCDEFGHIJLMOPQRSTUVWXYZ[\\^_`abcdefghimpqrsvxyz|,FA+@ABCEFGJKLNOPRVWYZ]^_`abcdefghioqstuy}~,FB+CDEFHJKLMNOPQRSTUVY[\\]_`abdimopqrstuwyz{}~,FC+?@ABCDEFGJKLMNPQSVZ[\\]^_`abcdfghijklmqrstvwxyz{|}~,FD+?@ABCEFGHJLNOPQRSTUVWXYZ\\^_`abdhijklnopstuvxz{}~,FE+?@ABDEFGHJKLMOPQRTUVYZ[\\]`abcdefhijlmnopqsuvwyz{|}~,FF+?@ACDEFGHIJKLNOPQRUVWXYZ[\\]^`abceghijklnopqrstuvwyz{|}~,FG+?@ABCDFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefhjlmnqrsy{},FH+?@ABCDEHIJMNOPRSTVWY[]_bcdgijkloprsuvwz{|,FI+ABDEFGHKMOPRSTUVWXYZ[\\]_`abcdefghijmpqrtyz{|}~,FJ+?DEFHIJKNPRSTUWYZ,B?+?@A,?Av?J+HF,?AgB?+BD,A?SN|]A?+UeWX[\\,B?+STGHIJKLMNUVOP,?Ap?B+Vv,AG+ufgPNihGvY,AIdAG+d_,AKQAIXAG+jm,AH+`KG,AG+|\\,AH+_mncd,AG+]ts,AX+A?,?AoA?+qr,ACBN{C?AcN~+_`,A?o?AfACUAW+ED,AV+JNMFE,AU+`_rq,A?zAE+QOPR,B?RAD+opqrstuvwx######,AQ+GHIJKLMNOPQRSTUVWXYZ,AP+stuvwxyz{|}~,AQ+?@ABCDEF,AP+_`abcdefgh##,BG+_`abcdefgh##,AD+_`abcdefghij##,N{+@AB,N~dN{+DEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,N|+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\,N~bB@+@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,BA+?@ABCDEFGHIJKLMNOPQR###########`abcdefghijklmnopqrstuvwxyz{|}~,BB+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstu########,?M+PQRSTUVWXYZ[\\]^_`bcdefgh########pqrstuvwxyz{|}~,?N+?@BCDEFGH#######,Nw+tuxy~,Nx?Nw+|},Nx+@ABC##,Nw+z{vwp#rs#########,?O+OPQRST@UVWXYZ[\\]^_`abcdefghijklmn###############opqrst,?PP?O+uvwxyz{|}~,?P+?@ABCDEFGHIJKLMN#############,?J+IJX,A?+RTdt,AC+DH,AE+UVWX,AG+T^b,AH+Qef,AI~AT+OPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqr,AU+@ABCDEFGHIJKLMNRST{|,AV+abcd,AWHAITB?+Q\\]###########,?C@?B`?FM?B_?CR?Bh?CZ?Bg?Cj?Bl?FO?Bk?DL?Br?FQ?Bq?Dj?By?FS?Bx?F+UWY[,?B+{i,?HPM^F?D+CG,M^G?H`####BC+DEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefgh#####################,B?+`abcdefgh,BIbBM+MN[\\]`,BN+CMPQT,NwoN~+ac#,AC`BGp#A?O###BB{BA+Z[,BB+|},B?EBA+\\],Nx+HIJKLMNOPQSTUVXYZ[\\]^_`abcdeghij,M^+fghijklmnopqr,B?F#############AS+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,AT+?@ABCDEFGHIJ###############,FJ+[\\^abcdefijtux|}~,FK+?ACDEFGHJKLNOPQSWXY^_bcefglnoqrtuyz{|,FL+?@ABCDEFGHIJKMNPRSTUWXYZ[\\]^`abcdefghijmopqrstuvwxyz{|~,FM+?@ABDEGIKLNOQRSTVWXY[\\]_`bcdefgiklpstuwx{|}~,FN+@BCDEFJKMQRSTUVWYZ[\\^`abcegijkmnoprstuvwxyz{|}~,FO+?@ACFGJKLMPQRSTUVWX[\\]^_`bcfhjlnpqvwxyz|}~,FP+?ABCDEFGHIJKLMNOPQRSUW\\_`abcdefghijkmnpqrstwxyz{|~,FQ+ACDEGHIKLNPQRSTUVWXYZ\\^_`abcdeijklmnopqrstuvwxz{|}~,FR+?@ABCDEFGHIJKLMNOPRSTUVWXYZ\\^`dfghijklopqrtwxyz{|},FS+?@ABDEFGHIJKMOQSTUVZ\\]_`abcefimsux{|~,FT+@ABCEFHILOPQRTUVW\\]^_`abcfghjklmnoprtuvyz{|},FU+?@ACDFGHIKLMORTWZ[]aefghiluvyz~,FV+?@EJKMNOPRVXY[\\^_`dhklmnqrtuvwyz|},FW+ACEFGHJLMNPQRSUY[\\]`bfgkmnpquvxyz|,FX+@ACDEFGHIJMNOPQRTVWXYZ\\^_`acdefghiklmopqrstuvxy{~,FY+?@BDHIKLNOQSTVWYZ[\\]^_`abdefghijklnortuvwxyz{|},FZ+?@B,DTIHW~D^BEKgDRMDSHDR?FYPFXKGS{F^mGH}FaLFGpHYWH]LEogDmHC~yEKHEYVDqwGByE`GGAmEWAFZMDFxETUFEkF~pGaCDAqDddEFIE}rGIlELKEHQDNlDOfFkEDDjFUcDvsEJSGvJH\\uEIIG?XD\\\\H[wF|aFGwFX|E^NFX}EPEC|oGsdEJ[FgVEUPFNlEOkEHrGGkHa@E\\~FHGEHmEJKC{sFRbDLIDI]FzIHAeDwmEaEEe[GE?FzPEbQFbDGYKHTPDALGocGJ]GB]DKDGcQDHdFZ+CFHJKRTXY[\\]_`abcefghijklortuvyz|~,F[+?ABDEIKMNOPQRSTUVWZ[\\]`bcdfijkmopqrsxz|}~,F\\+ACDEGHIJKLMNQRSTUVWX[,GUCHZxC~\\D_`HdpDm\\EI+pd,EYsGpxHqLFGEE\\nFaPEAqDLPDKVG}GGBKGs\\HQ`D?LFJGDcFEBjFCXGajDdSGJnE[kFkgDshFzvFSlErtGxeG~wH?{H{zEnSHCXFkSD|{FafGRUGS|En+TXU,Dw@DyFFVxHVlET\\D{ID~DG}^Db@GFAH@~HXZH]lG}xF{UGskEH@C}~DNWDL]G}+ghj,H@LE_FD|iGEWG`gHrUEEJDGjFWiD|kEUKE~QEzgDm}EPGDDtDEoE^CCwXFfHHd{FArF\\+\\]^_cfhilmnopqrstuvwyz{,F]+@ABEFGHIJNORSTUVWXYZ[\\]`bcegjlmnpqsuvwxy{},F^+?@ABCDEFGHIJKMNOPQRSTUWXY\\]^_`c,FVDDxuFMzGN_EQlEJgHQtEraDLYDJBEONHRAFmSC{nDwZGGuGCUGEIEwcErIHhrELTDL[DRyG`dD^_CwLDwBEldFo~HBgE?UEReFK[Gb@E\\OEHLGsaF\\kGwhHFFD|hGN[GS`HcODNAGYTEmJEB+lg,F@~GJLGGpCzREqfGVNERLFrXEf|EZxGLHDMTFlUC}fDEKEtJDpAGxlENQDNHGK+ku,E^dFasEO|Dn^DqSDvmGnfEJEE^sGpyEO?EMyG\\HHeJGoVF{_HRqCyfHWOHacEWKFKUF^+eginopqstvxyz{,F_+BCDEFGIJMNORTXZ]_`acgijmnpqrtu|~,F`+@ABCEGHIJLNPRSWXYZ[]^_`abcdefghnopqrstuwxyz|}~,Fa+?@AB,D[yDo\\DwwHT~D@~GA_DMAET]FTDDSpD?`GuDEICHQ]E[\\DWqE|mDvaDOtFAQG|eEHnEQcEMbD|zE}GHBsGFbG}oDoWEXgD~pEqHHXGGu@G`kEQPFfoD^MEhXEGODPGCxWFgJEBhE}CGnYEH~H?]HiJFfcDOBFVsEK@DKXEp_G~^D{ZHhoG?zH|~C}GDoyGtcF~DEUdFA|DDDDEqGXjDsFDm_EI|HDkFTsGwKFg_EC@FlxCzFFzwF]DCwPGFlDG\\DFyEhpDMgGyFHSCHZNEz@HXcEdYFa+CDEGIJNOQSTUX\\]_aceghijklmntuvwyz{|~,Fb+?ABCEFGKLMNPQRUVWYZ[\\]^_`abcdefhijlmnoprtuwxz{|}~,Fc+?ABCEFGHIJK,F`?DAgF^VEOOGfeDcCENbDv\\Fh~Ec|C{_GGxDUWCwqFUmFiVDxaDyIHVnDGZDOxFAIELuHScD]AEWdEc~HEFDSFEvrFynG_aEGrFzoFUtGKgFb@HZKG}]EDGFRvGnLElcDGyGtOEk`G@iGPpDZpDKECzMCwZDFPFqVHEJFoFC~BGx~Fn`Fi[EPfDsSDAkGCEFW@FqxEvkF~_E\\PDlWDnwFbJEQmEOREMiEKjHSXEOlG}}FlSFWhEHRDcfDPEElxDAbEGsDweEmECzbGsvGaJD}DH?mFc+LMNOPQSTUVWXYZ[\\^_`abdefghijklmnopqrtuvwx|~,Fd+ABCDFIJKLMNOPQSTWX`bcehijkmopqrstuxz{|}~,Fe+ABEFGHJKLMOPQ,E?_G?|EJDCwxDLTHBwEMwGBEEVeEomC|EEBmEv`Gn]D{xGZJD|REK`DDYGL`E`bDG?ELbGxGD?QDqZFdvDn{DGoFgzEA{H@RFZVD}+vV,FYCGxkF@nFXzFlHF]iDFrHARD_cC|MEzsG~iETKFkZFJCEucF~^Dj`EItDyTD[oGQAFkkDw\\D{^H?QF{SHa_EMAEzFFaWFAxDDwH\\ZD]jFStC|BFSwDyVEBeDd_Ev?Em~FaHDN{HZTDFJDG@EMHDOIHQRGoBGvKFGxFa^G\\uG~lGoLDN_Fe+RSTUVWXZ[\\]^_`abcdeghijklmnopqstuvw{~,Ff+ACDFGIKMNORSUVXYZ[\\]_`adgikmpqrstuvxy{}~,Fg+@CDFGHIKNOPQRTUWXZ[,Cw@FZnDNmHQHH`uH{MHSlDmYGmaCw+a[,DEkGPbEFADIgE_JC}VE@jDEzEs]DD[EIUEUVHX`GpEH?VFVWHB|F\\bEnQFIIFJkGnzD_tF\\xGtKE\\[HT?GAYDyeEw`DeQFjnF^lHSzEmtEUlF{MD_EDDPHW^DnxDahDOgGxqETeH`~DZcHQ\\FZ}H@@EMFDREDc+Yy,D]ZGyqE[tGvyGGtDH@EBoD_TGZ}DrgHxDC~CHa\\GmxDgdE@uDMCEH{H@NHCAHd~E@hG?KDC~G?rDoSHdtEspCyKFg+\\^`acdefghijklmnopqstuwy},Fh+?@ABCDFGHIJKLMNOQRSTUWXYZ[\\]^_`abcdefghijklmnpqrtz{|},Fi+ADFHIJKMNORSXYZ]`a,GsoDNPF|YFlNC{OCxNHW?ErTFNOGVhDwEFTiF~zEgIF^}HQQFx@DF`FBeDNLG~SGKBGshFInHdlErZD\\IGIrEUxGAiEG~HWqDegCz~Gm~FyyES}GNqH\\]DT`Hb]GAdDKiGn|DO_GAyDy^EqwGsxGIkHDYDOhEoZDGEFyvD\\^FCYEp}FqHDdJCz|D~~ECcFqiCwoDo@E]jG[ADroHSJHbMFUnFB|H?aDEnF{\\Gm|DdHDFcC|ZDOeDcjETvGAcDltEHuEJAG}ODxDEo^FkeC{NC~WE[LFi+bcfhijmnopqstuvwxyz{|},Fj+?@ABCDEFGHIKLMNOPQRSTVWYZ[\\`acfghijkmopqrstuvwz{},Fk+?@ADFHKLMOQRUVWY[\\^`abfhl,EtmEuiFeNGapD{VFSjEIYG}DC~nHF[EUfGCnGDPDy[GDOGtsDHnGeEGtJDcLDADCzWHW[FGuGDxGs^DnKGmbHXCDeFF{YDQODXuDWMGndESxEeAHQXFZUEyHDxqFSWE\\EE^PFj~GA\\GtuEC^FfEETaGtbDEGDGYHQaF{wGAZFyqDqVEwnE\\_FnXFYJHjWGENF}SFrTEO]HTOFg~DPIDRdElKEO@EGGHw|GBrFUXDHqH\\hGPZE_{GZcHW@HYSHRkCwiDOCFzXE_xGv^G?TEZsDyYF}xFk+noqstuvxz|~,Fl+?@ABCEGILMRTVX[]^`bcdefghijklnorsuwy{|~,Fm+@ABCEFGHIJKMNPQRUWXYZ]^_bcdmnoqrtuvxyz{|}~,Fn+?ABC,D^AG?~EaVDvdESzDI^E@lH}YC}ZGykDDkDmjD{RDvhEp]EJpGs`DDpHQhDJ}Eq^GJ^FJVD]aE]CGslDc^G}[GNFDQTFmLC{oEq|DlcDfPH{RDNcGZIHigGovGA`ETDH`}DZyHZFDGmFR[DHODn`EKAGcACxUEJOE?iEbyDDrDmWDE_GfAFm`HeEF|OEBnF@KGsnDDHDx~H?ZFPoGfCD[lF`DD|QH}^HVyG|gHk{Gn`FXwE`AE^[GviGstDG|G}IEzYEbLHSDHBlDZ|E][GbxG~FDRGFn+DGHIJLMNOQSTUVWZ[]^_abcfghjklnoqrstuwxyz|~,Fo+?@ABCDEGHILMOPQRSTVWXYZ[\\]_`abcdghjklmnopqrstuvxyz{|},FpAHiwDlhEtvEoeCydDmrHiFHDbEEgHAnH^hDOjEutDnQDF|DUIF|TF~oEQ{ELLEVpEE}EALFCIEp+VH,DcnE\\lGGiDbTDYMGpiEnjHB\\Dd|G?VDNvEthDPtDU\\GLvGNNE_wFe}DQKC|TDOGFZQGqHHWAEqrEuwGtjGcOHxcGsyDW~HzPFVTD}GFJ_E@gDR{CygEgiG``E@QG|oDRCFBWGXxHw~EsiDmND{WFyaDUHC}nFKsDO{DMYD?XDOMDP{CxMD~|FPYDbuGPjGB`G\\sFJOFrIExUFp+BCDEFGHIJKMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqtuvwxy}~,Fq+?@ABCDEFGIJKLMNORSUXYZ_`befghjklnostuvwyz,D{fGXMDSkEIcCyQEqiEGvGIpDRVDLMFK}EzPFSzDGQDKUGn\\EfOD}IE??EvmD\\NEkaFMnE`RG~WF{RELaEAbDScFViGpaFCTEubDmeDxzGLQEDKHzCFbyG\\VFofFYFDFoEBuFDKEXBDxKE@LGoMF@oEKdG}HD}|E@aGZSDZ]En@EASEDfDLHEB_EXeGs~Ff|C{YFBhEpFGmrGnqFzWGLcEWNDhYHlAEtPEvvGp@EszC{XF@jGMvEGUEBPH[LGsfFdwDFzD[}D^yE[yFTwFg|FfnFmTFq~Fr+?ABCEHJMNOPQRSWYZ\\]`abcdefhijklmopqrstuvxy{|}~,Fs+?@ABCDEFGHJKLMNOPQRSTUVWXYZ[\\]^`bcdeghiklmopqrstu,GAKHddG~xE~?GmdHw`DfkFzhF{HDOHE]@EbWG}PFpLHZEDNIE?dFU}EpqDLrDjHFyfEKcDF_GCIDvpGR^EI?DE?DlbC{MFdlDHAEAwEtMDn+CA,Gm+`o,EVaD~KHXDDeRFzfFyiDWHE]vDcxC|rDmuDI_GLYHaIGs}FSqHQ}D@FFg{CzvE]uHh}Dj@El{FZPD\\YDoUFkyHVsFDMDD{GAhGHoDdwF{CGKfEb?E^kFapF`vEJbEL`Fm?C~lDHiDFNGLOEfZHHsGvtGspGf@HSmFmlCzuFs+vwxyz{|}~,Ft+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklnopqrstuwxyz{|}~,Fu+?@ABCDEFGHIJKLMNOPQRSTUVW,D@dGGoDHPHdnEwOEyDEufDzyDBtDf[DoEEtEEp^FUEGQJE`gDdUGmqDK_HDpHXLGTHEcQFc@FCeGBuCycHBIEtFHiCDgFDY{EODHRoF^jC}dGCYFJ`GfQHdyF{sFz]DH~ETXHDtG|~G}BDNjFiUENlEMdFYEFfwG`VHWuEGiDIjGIAE`SE\\oELvF\\jFjlEs@FzRGfbDfOEGQGVHGIdFTKD?^CzJFUdGnjDpIDv}FlJEUcHFPCzIEsdGd^FsfHSeCzDGogG~ZH\\rEXJFe@G~PFBkEtwFu+XYZ[\\]^_`abcdfghijklnopqrstuvwxyz{|}~,Fv+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxy,Do|DIqGLEDDaGKMF\\ZEXuHqwCykEBIFq+}r,FzNCyTGleEXnHaGH\\XDaBETkHT[D}CFVHH\\UFj+^],DF?FAnFiWENiFhuFy_FMUH^lCxDF@wCx\\HDQDMhETPEVfGF{GGDDQMDopFUYH]_EJWFJXFU|DpDHhxGNIDp?DQ?F^hCw}EqmG@YEJQELmDvgDDvGv\\Gw]HSnC~pDNdEBfFAkDHfELOHxBDg^D?eF[vDLvFzaEQDESjEIHEMWD?SFGtGfHDErGn?Fz\\D\\FGNKHQfDEZDOZDrzFv+z{|}~,Fw+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxy{|}~,Fx+?ABCDEGHIJKLMNOPQRSTUVWXYZ[\\,C~IFjbEtYHB`HiNDU?DQUDL`DQnD{?ENhEdvDFnEDgDGID_iDJWD\\MF_LF[JDyvEDvFr_EHZEIVCyaFATG?BEJvFBcH\\_D\\vGJZE^nEbtFbTHaVFfPDbrDQrDNnEwsDDJDGzDmaGn}GAnDTBD]eE@rD\\PDOlFhyE@ODlSEMfEI_DNbEHbDnFE]nDRlFi^GJeHDvDyRGbcDcwD]mEKMGvgGBnD\\VFlvC}hD~jDm|Ek}DK`FlOFJAE`EF^~F[uEVvDEtCyNFZSDq~FidGPtDdMHl@DA?Fx+]^_`abcdefghijklmnopqrstuvwxyz{|}~,Fy+?@BCDEFGHIJKLMNOPQRSTUVWXY[\\]msz{,Fz+Uckx,F{+IO]vxz{|}~,F|+?@BEFGHIJKLMNQR,HeGECfEyBD\\cEWEELEDZoEJkEHhDzRHWSD]BEJHDUFG[`GDIG}bDTeGMpE\\dGtUGR\\DhiE_NEJeFnmHWPDDoE}[GooEN|GfGEFQF{EFBAEzdFODEeSFJ{DzIHBME[VEtiEL]DIrFHaG?@C|kDfdHDiFBXEu\\DJQCxOHZvHTlGT}FbIFsnDC`D]QERAGAJFpzEriEbpEd]DEvDMWEagFI@HzMFnpFJwFezE{RFOEE\\MHFKHqcFc{GMHGLSDONE_VCw|DMHDIpF_}DMEDGhDAGC}JC~OF|+UXZ[\\]_bcdefjklnortuvwyz{|~,F}+?ABCDEFGHJLNOPQRTUVWXZ[_abdeghijklmprstuvyz},F~+?ABCEFGHJLNOPQRUVXYZ[\\]ab,FVaFjJFqQEqdHYuDIZFQBDRhC~hG@SGMqG~]HToDzHE?[Eu^DwWETZGCwHR}E@JFA{FzBFqmDFHEa@FqpGHnCwcG}EHFNEX}CymGoDEQhG@IDBYFUVFFMDndG}|E|eCyEEQAHTbDzUEUXDGVGbAFBGDIbFKMFOrE]VFbvH[UCwsHAzHr]EvJDFZGt@DO\\EJMFMqGNpHZuH}CHRBC{uF}YDFKF@tHXtDqlHaEDNeCzcEy[FOHEesF`jHeNFTXDGWFWcEt@E^rDDlH}XG@JDQXFk{Fi~F~+cfgijklnqstuvwxy|}~,G?+AFGHIMNPRYZ\\]^`bcjklmnoqsxy{},G@+?@CDFGHMNOPRTUVXZ[\\]^_`abcdefgjklmnoqrstuvwxyz{|,HYED]CEJaHXFEd{DgCEOAFnRE{NHXJGIeDLaHaDDyOFAHEMrDLcGXNHq@HyRFaKH[qGvnGtAHx~E|]FeCD|THXEEGmHhsDOTHR\\C}bEVDDp+d`,F{TGXPEonD}JFMFEzcFz~DreEKZDliEzeDLtCxpEM_FTdEI`G|mC{eCzPEqeFyuGmyGO\\G]yF|VH?zHSbFmhHi`GbwGO|EsZHiEFz[DeGHyzFMZF_@GYAHhkHiADWZDOVD^JCxoHyeDLUG~GGCHF]QHeQGZmEz`GSREZ{EDaE{jG@}GA+@ADGILMNOPQSTVX]befgkortuwxz,GB+DFGHIJNOPQRSTW^_abemtvxz}~,GC+?@BCDFGJKTVXZ[\\^_`abcdefghijlmorstvxyz{|~,GohGIQGKjFZqEoRD~XGM|FKjGKDHSYEnZF^ZHREDLnGKADEQDw|GqKGswCxGFMjE]YEaDHDuH[HFDcEq`F[HDiQHT@EnNF}MEWfDnODexDiYHV+gv,CzkGOKGQXEikFZ^HSoFKZEaeDl^F[nHEYH\\`Fr[G~vGo[D{dFprFfWGfDErKG[[DnEDxAEbHF[_FztDETDDLDJHDghF{DH\\aGJVENNF]CGVOFfQEwyDyXDeXGSPF@lEoPEI~FY~ETNEAnHV|EWMG]^HwbHRlDOLDP|GokEPwGD+?@ABCDFHLMNQUVWZ[\\]^`abcegijknqrtuvw,GE+@BCDEFHJKLMOQRSTUVXY]^_`acdfhjklmnopqstuvwx{|}~,GF+CDFGHJLMNOPQR,EPxGWPEg`GE[FbgEPhHlSEIxE[jGMjDagHzWEqjE{_Dn]HXKGoJFH^E^OEJFFH`CyhDfEEnLDaREYmDxTDJ^EDTE[gFZmF\\eFHfFhEEJ~DRiDPOHQ_HAbDg[FyrEoUCxBDduG?ODdGDLVFSvHY}DZIEK_GCPE@{HVxEvUDPaHe@DEDDjhGB|DemH[RD?iErdDo{EJ^C|_DK~GDzH?EEyyGSjEJGDxsFa}EQtELzD~tDgWHD~Hw^Do~ELNG@ADl|DTmHT+IL,EuDEAgE^_FJ]DF\\Dm@GF+STUVWXYZ[\\]^_`acdeghjmnopqtuvwxy|~,GG+BFGHIJMNPRTUVWXY\\_cdefhmqy{|~,GH+?@ABDEGIKLMOPQRSTUVXZ[\\]_`abcdefh,EJfEr]FHZEHlHQmFy|GCREtRDE[D{CDdsDIiE?QDdrEYUGXOFU^EKiEFeFrnGnyDReEkfHwdEmsGVTDPTD@uEqcDTiGusFGkDwTE?TFOuEJLEMQFHKD}WExBEs}ES?E|WFZWFbOFZ{FTSDGcDNZCxRDy]EV@G?iGBUEIZDQEDGgFAmGaLGvPEr`DPwGBYD^xGbsGtSHXiHDLC|hEqZDUvFZEF_oEIgFBxE}MD|lGRkEbYF`{FnvGEgE[JHxNELfFaoD\\nF_QH[xEHxEIjDIGFOtEnVGH+ijklptuvwz{,GI+?@BDEFHKORSTUYZ]_abfqtuyz{~,GJ+?ABDEHOUXY\\afghiklmoqrtuwy{|}~,GK+?IJLOQRUWX\\]^_`abcdehimoqvz|,DTcGC}FUqFYmDKxFV]DBzDp@GlkFnFD@NFHFHiVHbWE{AFRaFdgEQFF]dEJ{HaPGsjDR@G@WCxQD\\iGJxGOLDxrDFlFRuGnCDpND\\`Er{HaFDhEF_sHlCG~jFqTDHUEHPHRyCzEGMEGP`GNhGQqD^SE[sD[BEXmEteGopEZ\\F?PE[^EkyE_UEGYDezCwBDFCE{EE^QEqNDDuEbJDdFElfFTeDsMGCOH|OEVVFd+G@,HiPGtvDqACx]C{@DOnDdPF_KDXgEoSG~CD{BEp|ErbGmjEMOGK+}~,GL+@ACDGIJKLMRTUVWX\\aopqrstuxy}~,GM+?@ABCFGIJKLNOPSTUVXY\\^`abcdefklmntz}~,GN+ABCEGHJLMOPQRTVXYZ]abcefgjkl,E@oEs|FHtEHeHQMHRDDLBG~@Fl}Cz^GoeCx}HzSHQ+pr,DHLE|[H@bEtDGosD_PDtKEk_ElHE]iDPZGDSF}KDaXGSvD{yEIaEhFHSxETqEACE`dF]fCxSC}gDvfH]WEQkF~WDrlC~NFiLDGFGKCCwSE?nFiBHQeC}tCyqFfeFOsDJcGIxERQFe|Dn\\Eq@H\\QG|zEoaD?}DL~EwDERMEXsEooEBDH`vGnvDyEFO{FhvFfJCwWHApFOBEpADZYHDJErDGuJDKyGZEEZqGynDpGHhpEw_GN+mnrstuvyz{}~,GO+?ADFGHIOQRSTUVXYZ]^_`abhijklmnoqrstuvxyz}~,GP+?@ABCDFGHIJKLMNOQRSTUW\\]^_acdefgimnoqsvxz{,DNUDguH}JGubDMzD[GHafE\\BHEZErHDDgFVIEJrFIkDGwDI\\F{yFASFWwDLsHxIEevF`mHZ?GbXF}cFCuFFBDEHE^RFRcDbcESWDYvGmhHduEHoFzTEBxFBlDbkCz@CyyD~LH^fCzzGmcDGBDeIFyjEHSCzLEVdEGMGKwGRHGLbG]LFESEyuDmxFzQDEVENHE^SGAHGKxG_TDCQDlyDeAG}pCxrEp\\DDdGcdG|nHWmGTIFP]HSOHVoEueGJdD{pEQQEsQGOgGDmHrBD`]GtZCwHDN@GP+|}~,GQ+?@BCDEILNOPQRSTUWYZ\\]^_abcdefghijklmoprtuvz{},GR+?ABDEFGJKMNQSTVWXYZ[]`acfghijlmnpqrstuvwxyz|},GS+?@A,C{]ETbE`PDVRCwfEOSHiYEHjDjAFP^GHqEuhEbmDBfGMMF_AE\\?DGxEqXFypDAzDTdFD]FlZEXQFNIGJjE\\HDppDG_FD|G`jHViHXTERDGt`GErDUCEpTEHFF{mDaQC{cDTEGtNEXKCwIDoYGbrEaaELMFgLFBfGILDJyH^uDoPDRgHAtFzLDdaGtIGZFGG+KL,GteEPCDoCEDPEuHFc}Gm}F_vFSrDPzC{wGyjEvpDg_FzDFd]EqGDm`DhuFSYGA}EDMEwVDboFS+^d,FHqDLFFzrGS+BCDEFGHIJLMNOQSTUWXZ[\\]_abcdefghilmnopqrstu}~,GT+?@ACDEFJKLMNOPQRSTVWYZ[\\^_`abdefhijklmnoprtuvw{|~,GU+?@,F[@FZZDHhGB[D[bDwGDcpFJmEU|Ex~GnVDowGXpDL@F^rEJ}EVuCz?Hb^GY?Dm]GnEDNqF^aC|~DpMHhuDfJD{NFcyDbjCwUE^~CyJEJlGiRH?\\DI~EWnDV[DXkH?ACzTC}LHFIHdoEoNDwAE@BDmcGfEGnTESuEHJHeUDmGDn~EMGDSmDNVFWeDD|GSkE]aEarEmIEIQG}RDNSGGQEvPFUNCxeGtMDloFE^GUnEYPEZXF|qG[?HzLH{_Dp]E[nG~oE_PE\\^EGLFjUDaDDyuEToE{pGU+ABEGHIJKLMOPQRSTUVWXY\\]^_`abdefhjklpqrstuwyz{|}~,GV+?ABCDEFGIJKLMPQSUVWXYZ\\]^_`abdefgijklmnopqrstuvw,E@TDGvG?LEPSG`oFShDwDE_REJsH[[DNKFG|Go@EosF\\`FgMDOmF]kH`yGG[GnsF`TE[SFB@EUnEQTDWuE?\\Ff@DNwCw\\ElzGAEDnyDVbDZZC{+y{,HdqDvrE\\}G?wE?AHaAH?@DmJGm{GntEO[GHWER]DV|GJNHDdC~VFs_H?^Fq^DBrD`PEynDm~GnHGABHDwGQ[FmVGX|HY+JN,FzdHjRFaMDq@FhVH@AHYfFd^DlXEL^FkJGRPEalDSEF{hFOOFsaHS@EH?D`KCzUDmBDdxD`SGV+xy{|},GW+?@ABCEFGHIJKLMNOQRSTVWXYZ[\\]^_`abcdegijklmnopqrstuvxyz|}~,GX+?@ABCDEFGHIJKQRTUVWXZ[\\^_`bcdefghi,FLlEK]GxJGwNGBMGJSEIkDNoEroHD]DciE?@EpoD\\LEPIGsiFWjEzhD\\ZEi?FVoE|lGo+lG,D\\eEnnGaQFarEMaDNxFAlEpcD`WEOiD_AEb_GEZDSOFrUD?WGyyEvKGu^FBjEMNEuZEzSFzeGOCE`BH?BEvWHXuGmgDdVFHxGVcGD}FU{GiIEanDHSGwaHSPENOHaWGxCDT{C|REZ~DYNEBTEuTDHBDpHDchEvzD`jFS+o[,E@kGGSGDEEKPE\\`G~aF[yGvrGssHR@DwUDMDDOkFBBGX+lnoqrstuvw,GY+BCDEFGHMNOPQSUVWXYZ]^_`adejlmqrvwxz{|}~,GZ+@ABDGKLQRTUVY[\\_`abdefgijkntuvyz{|~,G[+@CDEJKMNOPSU,Ep?DzvD@[CylDylEKyGHFH?YE`OHDmF]rDOKHR[D|cFjdE`uELDFlQFz^FVZD@vEITDcsH?NDFwFfBFi@DZ}D}QH?SEuADp_D[^DOODDSExLDZaEMgHaRGD~G[TGciH??DO]DpnGF?EJUEHWGCpHwtHX?Hh+m{,EclDedEJRDS}EKUDRFGZXEs{DgBFReGa[EliDcUGpKD{nEx}FMhH`|CwwFBvDmKFaVEK|EXYFYUEBJDmZDhHCwFGDTEpiFMJCy`E]HF|PD}?EVyE[ZD~WDeCDg@G[+XZ\\^_cefgijklnoqrtuwxy{|,G\\+?@ABCDEIJLNOPQSTUWYZ[\\]^`aefghijklnpqrtvwxy~,G]+?@CEFHIKMNOPQSTUWXYZ[\\]_`abc,DvLD}mDLpH^eG~\\E`DDZsDSnEB^CwyE|LFzsGJFGOMDfSC{+^i,Do}FykE[iGSYDPrFTNGBBDUAHlNC|LEwlGoRDoHEDoDLjFW^EwhGYIEUFHVzFyxDOzFgrFsIHVmDV`F~@FRmEK\\G[VEu`Fi\\EGPEU`DLfEN`EqBDvjDP[HQgCxKEp`GnkDpJEV_GI[EafDO+}s,EnJEleCySELADLGGG]C{LC}mD\\]EGIHZ}EXcFHhDJ~DI`EA^GnnEWSFEXE]OGd~F`QF^|EXoDWzDOwHS`FHyG]+defhimopqsuvwxz{}~,G^+@ABCDFGHKLMNOSTUVWXY[\\]^`abcefghjklnopqrstuvwyz{|~,G_+?@ACDEFGHJKLMNOPQSVWXY[\\]^_b,Fg?E@nDwKEAHGE\\DcTEB[FECFBnEyiEpOFI?EiCGalDwlCx_DirDU[HRbEsVFrzHYXEGNFzEF]MGX}DKbH[]G}UEYFDr`C}_FJlCwJDMeDcNDOREM?HSgDDGCzXHq[FycDQwGscG`SGGvHVqEuMD{eDjKEW}HXhFMoFKmDM~GDyHeDF}`DmiHX+vO,Fy~FZwDMaHTuHeXFmpGdCExWCx`F~SFddGneEBrDRLCyjH`xDvvEh`DBNDOPGp`GOfF`\\H[CDHIDRmDYbHS?EuGDmtEvEEXRG_+cdefghijklmnoprstuvwyz|}~,G`+@ABEFGHIJMNOPQRTUWYZ[\\]^_efilnprstuwxyz{,Ga+?BEFHIKMNOPRSTVWXYZ\\]^_`bdefghi,DoNDl\\E_`GAUDTwFkPETGEdSCyZElFG\\MH]JDLNEK^EOyHAiEU[GB@GoODEXEaoDLwG^xEFGEr+Cz,GoaDpPGUiGInHSKEkbG}ZEUoD~+zB,C~`G`DEW^GDdFKhEByDDsDGPD]JD|aHAaG`KHEQDxwE\\NE?fDfRDDCDFuGBwDKGEpxHZCFEIC{PC~mF}]E[|DVDHSGFf?GaUFzbDa^EGKH[?GXYDWWH`zD}OGmwGRCHDVDNXEVlDyNFT[E@cFtmDh~Fz+il,G|hDUfDmbEAkEVJFMCGa+kmnoqrstuwxyz|}~,Gb+?BCFGIJKLNOPRUVYZ[\\]_`efhijklmnqtuvyz|~,Gc+?@BCDEFGHJKLMNPSTUVW[\\]^_abcefghklmnpqrtv,H?HFXbF[hFzYH\\sGUZDleFhsHZiG`?DJJFEND}iEVkGnaDnzHhnDv`EmHEpZGm+ln,H?IG~DDMJEI{Hw+el,DP?CwjGI|FHXGY[DsUG`XEunHZDDRPCyYGmuFCHDQ|HWHFB^EvxFZOCwdF_SG[QDqhDzuGg?Ha[HWMFAMEq~DdCEMhF[{G`LE{SGHrD_oFFTDMKF_YHZ@DS@D|eFCoDmsGoYHiKEmBDcmHwnFffE\\gEHkC|nFU`F}IEsJHWrEofCzoFVQDDzE_vE{}HA?GDoDeUFPuGc+wxyz{|}~,Gd+?ABDEFGHIJKLMNOPQRSTUVWXYZ[\\_`abcdfghijklmnopqrstuvwxy{|},Ge+?ACDFGHIJKLMNOPQRSTUVWXYZ[\\]^_`,EPFDofH@dFiPGobDfYDQkGG?GLnGe@G??EcoDXMG?uFGvHFMDEuCx^H`tEMUCwYDNuEZrGDJDc[EuqCw?DbxDKzENUHRpC}\\C{IG`bHaODcvH@VFfzCziGBoFUPEqADm[DfgD|\\EcDGY@D?YDvqCxXF^bCzdGHyEIPEWRHAPDpxCy~D|xGFEH?wGACFUjCyeGbSECNEnDD~ECxHFZIEyaGnbGmmGoIGnPD{AF~+{K,FzMGKtGLjDZ_EmvH^rHWsDfzDO^HRuEvjDnDHdmDoxD{THYOGe+abcdefghijklmnopqrstuvwxyz{|}~,Gf+?BLRSTVWXZ\\^_`acfghiklmopqstuvwxyz{|}~,Gg+@ABCDEGHIJKLMNOPQRSTUVWXYZ[\\,DLoGJpEgpDhsHxoDySF{gGMxGO+cd,GLfG\\FG~MGtaFZGD|pHaUF`kEW_DR^EJdC|bGFBFVGDywHZLGwIGZxDQNErrEuKEowE@~DJFFSgDx|C{WEA_D~fDocFSpHAmHR?FIxEqxEwwHDHE[HDN+Jr,C|PHFHGnpDNGDx{G~AEvcCyMFZAEeEGX]ECYGGEC|XC~]H?}Hp{ECHEw+\\S,HYDCyGDgpHZgCwMDp~FexDmFGnlF}|FMHD^^GIJHB@DO@H@FDUzDriD}`ECGEkqFJpGAqGiHGg+]^_`abcdefghijklmnopqrstuvwxyz{|~,Gh+?@ABCDEFHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwyz{|}~,Gi?EtsDnRGbTHaCGpjHhlHwrEwIDEcDDBD]bGa@DM^ENsG}TDZlDPWD[EFK~EyOF{WG~[GJPEC~E?gHXaEZoFyeGuIGvBHQdDqrFqcE[GEAeHWDG?WCyPHBfDK?HXgDD@G~OGTsHD\\EXTH^tDlTDK\\F_wE\\AE_|DRHF@}DmoG||DELD[gDQpESQEYAGt+]B,GCNGPkH@lFr^DF~GVzE]bEVhE}`GYcGy@DXiH?_FYAF@uFFdGsbEJhDGXEr|Gs{E?MDa]EEMEZ}Gt_EHMDUrEwbE[lG|fGi+@ABCDEFGJKLMNOPQSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,Gj+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`ab,HR`HVwF[gE_DEegDQJCxLFAwGnGEPWEUJDmDFiCD?yDngF]zEn`GhxFqWEq}FZNEUhG}VDslDpTGWwE_GDL_EGWFjXExZFz|Eg^Fj_D|oE{rD{_EMKEugE\\UCwGDwOGseCzVGB?FWsHY[EJZEWlEH}Eq{GttFDfF|hDDEGAFDNkH@mEIWDRqGZoG}XG?DHSVGSVG~XEtXFNLEU^F[^FSCF_fGFzGs]HQGC}eE]TFUxGnIH[FEKnHTFHWtGQwEKbF\\@D}@FJoCyHE?SETsEJnElbES~Gj+cdefghijklmnopqrstuvwxyz{|}~,Gk+?@ABCDEGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdfghijklmnopqrstuvwxyz{|}~,Gl+?@ABCD,DwfFVFHBPGn@GI\\E]\\ESnDOpG[WF^dGAaGCAEp@CxJFzFG@KFZsEcLEmUEHfD?{C}CD\\?EKFElaGu}DNiEVgFywD~VEKYEMvGF+rs,F|mDw[DrXDGuEXyFfhFgYGsgFAXFVSEz]EqzFiQCwlFZDD~_HQ^G`vFzGFfLGA~HFLCzqC{VGG^DPgDv]EsqGnKFqdG|sGAWDwYDQQFYpDmXEW{HicFN_E_iGZZE[pFKiGn+wZ,H?OFjxFBZFDmEJCF]hDWpCwzGPVE^pDIhGZ?GsmHRwFlPGl+EFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdfghijlmnopqrstuvwxyz{|}~,Gm+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^kpz,Gn+FOi,Go+H],C|NErgFd\\HhzEIRFGiEJ|CwRF_UG|kEQoGtYFnEE`hDyCGbDDeEEQ]DbmFIuEcMHSdG~|GtWD\\_F{?GoEDFEELHEJXDLRE`KFOaGK@HDKDTCF\\?F@{EtIDDxDQgGtCDf~EzJEvCDl[FsjCzSFp|EzRDlOGFiEwLDlVHkBEbTGwiDmVFz{E?zFytHAxGtoDdNENLFf^GurDLQEVNFdUGnDHWzFzCHQzFyADWsHEHE[?F|iDoIH@tEWgDveC|OE^]D@YC|[D\\ODyf#####Go+wxyz{|}~,Gp+?ABCDGIJLMNOPQRSUVWXZ[\\]^_bcdefghklmnopqstuvz{|}~,Gq+?@BCEFGJLMNOPQRTUVXYZ[\\]^_`abcdefghijkl,CyLCwKDD?CwODz~DLDCwTCyWCw]HkqDlkDXhCwgFeyCw~DKTCxFDclFGzDLmEoODZ^GBcHeVEnRF\\}H{VCwuCy^H{OCx+[h,CyRGIGDlZDTkDWNCzCDM+L\\bdm,H\\dGt\\DKYDNtDK+em},Gt[DL+eb,DG+AGMlr~,DH+?K]`[,GQnDH|DI+A@OR,DEAF|SCyzCz+BHAg`j],C{ZCzrC{aC|cCztC{+dfHj,C|+]f,ESwC|+Y\\,Gq+mnopqrstuvwxyz{|}~,Gr+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,Gs+?@ABCDEFGHIJKL,C|+^V,C{+q|,C|+us,C}+PHBN,C|+}z,C}iC|{C}+kS,C~+egiDYb[P^w,D?hD@KC~rD?+kNml,C~}D?+[Kdg,D@+}BTGMkz,DA+dfhy,DBUDCEDB+lkem,DC+FJ,Cz\\Eo|C|+Wd,C~MH}_EpEFpsDDmDv|HzHHeWDE@DcSDJxDKLGgFDKODFjDcXDDTCy_DDUCyrG`mGacCytGCSGbQFe?DksG_BF}wDE+jp|{,Gs+MNOPQRSTUVWXYZ[_,Gt+PQV^dghikmnpqwxyz{|}~,Gu+?ABEFGHKLMNOQRTUVWXYZ[\\]_`acdefghijklmnoquvxz|,Gv+?@ADFGHILOQRS,DFFDE+Uad,Gm+_efistv,Gn+ABJNMQRSUWX[^_cghmorux{~,Go+?ACFKNPQSTUXZW\\^_`dfijmnqrtu,DL+hy,HW+\\a`pi|{,HX+AHS^fkqs,HY+GLVo,HA+VZ\\Xk`sruy,Gv+TWX[_`adefhlmopqsu{}~,Gw+?@ABCEFGJLMOPQRTUVWXYZ[_`cdefgjloqrsuvwz{}~,Gx+BDEKLMNORSTUVWYZ[\\]^_`abcdfgijmp,HA+wo,HB+ND,HA}HB+OCFRea[VZjn},HC+Ca]bpnx,HD+BE,DGLDdADI+akl},DR~DJ+OUo,DN^FFmF^LDzsDF+t{,HknDMuD{@FTYDvnD\\KD]+h`,D`}Da{Db+DP,D[+hkirxmn,D\\[D[zD\\+Ah,D]DD\\jD]ED\\+{zglur,D]+lcKq,D^ND]+fsR_,D^+TWYXQ,D]wD^+snwc\\,Gx+rtvwxyz|},Gy+?ABCEGHIJKLMPQRTUVWXYZ\\^_`abcdefghilmoprstuvwxz{|}~,Gz+?@ABCDEFGHIJKLNOPQRSTUVWXYZ[\\]^_`abc,D_+JL,D^+|l,D_+?]X,D`CD__D`+dk,Da+@HY?,HegH{XEF~GH+x|~,GI+NIgCMPVXjw}o,GJ+GIb,GI+Wvm,GJ+JK@,GI+hs`i^,GJ+CM,GIcGJ`GKHGJ+vc,GK+NF,GJ+[sQW,GKKGJ+zR,GK+PYEST,GJ+_T,GK[GL+PZ[,GKGGMQGK+{sp,GMZGL]GKnGL+NFB^?,GKVGL_GK+lyr,GL+ed,Gz+defghijklmnopqrstuvwxyz{|}~,G{+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,G|+?@ABC,GLgGKZGL+hkilm,GMoGLwGM+rs_iR[D,GL{GM+uh,GL|GMwGLzGM+W]gy{,GN@GO@GN+dW,D_FGO+WJ,GN+\\|U,GO+[wPE,GN+S^,GO+NB,GN+wxiD?,GOeGN+o`,GP+[PYXr,GQ+FG,GPyGQHGPwGO{GP+Ehu,GQ+KM,GOpGPlGR+@LOe,GQ|GR+RI,GQ+~y,GR_GQ+`xsV,GR+db,GSKFSLGSwGRoGS+x^y,G|+DEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdi,G}+?KQ\\_`acdefiklmnqrstvwyz{~,G~+?BEHIJKLNQUVY_`bfknpqstuyz{}~,H?+FGKMRTW,GTUGSzGR+~{,GT+XGgc]y,F]aGT+Bqz,GU+cgFN,GTxGU+m[Dxvo,GV+R@[~,GW+fDhU{,Dz}D{GDc{Dd@G?vDd+TYW,DKNDo+adks,EH+Ki,EI+^z,EJ+IYVm,EKaEJuEKxEL+JB,EMlENuEL+py,EM+Ms,ELlEM+kI,ELhEM+m{,EN+qw_~C]M,EPQENEEM}EP+D@,EO+JZ_Ke`,EP]EQCEPlEQUH?+X[bcdfghijkopqrsvxy|~,H@+?BDEGHIJKMSTUXY[\\]^_`cefhijknopqruvwxyz{},HA+@CDEFHIKLMNOQSUWY[]^_cdfghjlqv{|~,HB?EPyEQ+vwXy,ER+?OVca,ES+Hdm,D{JD~QFSXD{PDL^DN+p|hgz,DO+QUE,DP+JQRSUB,DO`DP+VX,DO+bq,DQ+AS,DP+vpc,DQ+YZC,DP+ue,DQ\\DRODQlDRADQsDRQDQ+fe,DR+RS,DPqDQbDRTDQ+z~,DR+KXY[,DQ+hic,DR+\\N],DSZDRfDS_DR|DSSDRrDS+abNPfi,DTfDU+Nt,DT+Hl@T,DS~DTODS{HB+ABEGHJKLQSTUWXY]^_bcdhikmopqrtuvxyz{~,HC+?@BDEFGHIJKLMNOPQRSTUVWYZ[\\^_`cdefghijklmoqrstuvwyz{|}~,HD+?@AC,DSvDT+Utuv,DS+ro,DT[DUJDVQDU+BpxG@^,DT}DVUDUPDTzDV^DU+|}SX,DV+ivH,DW^DV+PjkSe\\CndqrKLgtc,G}SDW+]GK@cb,DV}DW+?fl,DXWDWxDXVDWkDX+LaX[KS,DYEDX+cpjz{,DY+DRn,DZ+SV\\`tjx~,D[+CIH[,Dw+NXSPpz{,HD+DFGPRSTUWXZ[^_efgjlryz{,HE+?@ABCEGIMNRSTUVWX[\\]^_`cdefghjkopqruvwxz{|}~,HF+?@ABCDEGJOQRSTUVWXYZ\\]^_`abcd,DwvDx+CSZ]`,DqKDpyDq+LOUGWXPY[ta|kjpb,Dr@DqvDr+CQcJd,Ds+ABfemc]EZ,DtWDs+}s|,Dt+kZn\\jJIhs,Du+AX\\,GprDuvDvDD|+rv,D}+AFHKTX[glt{,G`aD|`FI+losvw,FJ+B@MLQgnhqsv,FK@FJrFKBFJyHF+efghijklmnopqrstuvwxyz{|}~,HG+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,HH+?@ABCD,FJzFK+VR`I]\\Taxdkwp,FL+OLV_kn},GGZDcdHbfDc+cA,Hd+bfghijksv|,He+?CFILOPRST,Dy+?PJUd_xt}r,GtRDz+QPZgi,GEyD~+CHUN,E?BD~mE?CD~+`c},E?+DE,D~+ilw,E?+XteZNLhjI~`,E@+wxzyA,HH+EFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrtuvwxyz{|}~,HI+?@ABCDEFGHIJKLNOPQRSTUVWXYZ[\\]^_`abcdef,E@+i|,EA+UYl\\BQKZ,EBkEA+zp,EB+\\WEY,EAsEC+_eTb,EBsEC+?Mj,ED+It,EE+kSfv,EF+St,D~\\HYrHV+hjprtu{},HW+BCEGIJKLNQTUVXY,CwkFG~EGTEotEp+S[I,Eq+bDOSK,Ep+ghsu,Eq+Eh,Er+OS,EqlEr+vwpV,EqqEr+_Uyjm,EqpEr+Rn},HI+ghijklnopqrstuvwxyz{|}~,HJ+?@ABCDEFHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,HK+?@ABCDEFGH,Es+xfK,Et+BG,Es+FCXMj,EtLEs+mtY,Et+NQS,EsrEuPEtnEu+]_,Et]Eu+RS,Et+[_{b,EwYEv+FD],EwMEu~Ev_EwPEv+e\\X,EwUEujEwKEumEwjEx+mMj,EyqEx^EyEEx+RS,Ew+qd,ExCEz^Ey+pW,Ez_E{lEzaEy+df|zv,EzVEysEzNEyNEzAEy^E|+aEF,E{+cT,EzxE{+nu,E|+Js,E{+iHh,E}+HLK,E|+wq{y,E~PHK+IJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|~,HL+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghj,E~HE}+fxu,E~+A`m]_n,F?+YbZxt,F@+N],Dm+?CTRdw,FSnHi]EOsDn+cm,GcoDnoGxFGkFG}uG~+RTdmcherg,H?+DCJePLU`tuln,H@+CPQOgWaZ,EYxH@+s|,HA+AGBJ,D|+OVUW,DozDQjDp+OX,DlpDp+be,F}{D{+ihl,GHsD{{HkzDpmDe+@BLhib,HL+klmnopqrstuvwxyz{|}~,HM+?@ABCDEFGHIJKLMOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,HN+?@ABCDEFGHJKL,DeVDfIDe+j]c,DfQDe+qn,DfVDe}Dg+DE,Df\\DgGDf+bWx,Dg+KHqsPbR,Dh+?fIT,Dg{Dh+at,GBkDi+iZ,Dh+vy,Di}DjjDiqDj+QS,DiwDj+_bpUeW[,Dk+HVUqv,Dl?Do+T[,Dl+YdrPRa,Hh+tvwy~|,Hi+?@DGIOQRUWZ[\\^_abdf,Fy+^`bdgh,HN+MNOPQRSTVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,HO+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklm,Fy+lo},Fz+?@AHJKOSVZ_`gjmnpq,F{LFz+uyz},F{+@ABFGJKNPQVX[Z^`abcdefijklnopqrt,DxyFT~DvZFS}HATFM+MPma^,FN+NAP,FM+vr,FN+?HGdX,H`{FOIFN+hf],FMyFNqFO+Ni,FPZFO+edgomk,HO+nopqrstuvwxyz{|~,HP+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghiklmnopqrstuvwxyz{|}~,HQ+?@ABCPUW,HR+FNRSYez,HS+[_,FO+ZY,FP+@[VTXvl},FQ+[M?@FJ]ghOf,FRQFQyH^+ijk,E\\+KR]Gh,E]+dF,E\\+ir,E]+Wf,E\\tE]+g]lJ,E\\+v{,E^oE_HE^WE_IE^hE]oE_KE^XE]tE^YE]rE^\\E_?E^BE]wE^aE_ME^+@|,E_+qr,E`+_`MaCc,EaBE_\\E`+Te@f?,E_}E`+IH,E_hEa+tN,E`+sv,EaRE`jEbAEdmEb{Ec+^_,EbxHS+fr|,HT+BGJTY_mstvwxyz{|},HU+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,HV+?@ABCDEFGHIJ,EccEboEc+J@,EdVEbbEcOEdpEcxEd+_A\\,EeCEdjEe+?W,EdwEcsEfKEe+FG,EfMEeHEd+ebx,Ee+Zfzjl,EfSEepEf+@I^,EeTEf_EeLEf~EgnEflEg+VW,EhdEfqEhCEg}Ei_Eh+OZ,EgtEiMEhxEg+|g,Eh+W{,Ei+POhVj,FKvFLQEm+@AFCQRLYZ`i,G|+jlpqrtuwvxy{},G}+@ACFJ,HV+KLMNOPQRSTUVWXYZ[\\]^_`abcdefk~,HW+FRWZ]_bcdefghjklnovwxy},HX+@BIMNPQRUVWXY[\\]_bdejlmnoprwxyz{|}~,HY+?@ABCFHI,G}+LMNWY,GzMEG+JVZ^a`dck,GFfFR+ns~,FS+NPR,ESsEV+mno,EW+IX,E\\qEW+BT?,FADEZvEW+\\sput,G?EEX+^S@NU`Vv,EY+CKf\\},EZ+Z[eh,Gs+qruz|,Gt+?DEGHFLTX,Gf+FIJKMNOP,FHmFI^FH+\\en}~,FI+CJLNQ,EK+Gq,EMoHY+KMPQRTUYZ\\]^_`abcdeghijklmnpqstvwyz~,HZ+ABGIJOPRSUVWXYZ[\\]^`abcdefjklmopqstwyz{|~,H[+ABDIJKOPQSTVWXYZ\\^_,EO~ERWG?CEn+ir|tx,Eo+DFELTWXY`hciq,EStET+Tj,FH+LQU,FGoGXaDGUGA+^[R{,E[IGA+|pjlsv,GB+fghiZACXLV,E[OGB+\\jpsl,GC+LM,GB+q{,E[TGCQGpYGC+u]kWq,GD+GKRsXYp_h{|lf,D`LDitGE+GAP,EzTGE+bi,GFKE[eGFIGEzH[+`abcdefghjkmnprstuvyz{|~,H\\+?@ABCDEFGHIJKLMNOPSTVWY[\\^bcefgijklmnopqtvwxyz|}~,H]+?@ABCEFGHIKMNORTUVXYZ[\\,GF@GEeEk+cvx,El+BEX,Hb+PQRTXY,EmrD|?EnAGfrEUOH|PEU+R{,EV+ECBKMQU,FA+?[U\\z,FB?FA+vjp,FB+gI,FC+ORUnp,FD+r[gDqIwy,FE+Wrtg_,FF+_Sfx,FG+\\g,F@kFCWFDeFExEG+}|,EH+BGH,FczFd+?EHZ[RYaV_nfy,Fe+DIYfr,D~+PO,H]+]^`acdefghikmoprtuvwxyz{|}~,H^+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdgmnopqsvwxyz{|}~,H_+?@ABCDEFGHIJKLM,E?{E@+\\Yf@Xb,EAjEC+EL,ED\\EE+h\\,EF+JP,EGEGA?G@~EqREruEv{F^+uw,F_+?HVWP,EUjF_+l[\\xyz^{dkbh,F`+MlUV,F_eF`+OFKi,Fa+ZRYF[`bqxd,Fb+SXHkq,FcDFbsFc+Rc]s,H}ZHz+xz{,FZpF[+CL,FZxF[+FGYaXletw,F\\+OPFBYg,H_+NOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,H`+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklm,F\\+ad~,F]LF\\|F]+?KP^_ot|,FSyFT+?MJGZqx,FUBF|+W`^,GhGF|+gspx,F}@F|}FZ+Ld,G_qHQ+DEFJIKLNOSVTYZ[bcjilknoqsuvwxy{|~,HR+CGHIJKLMOPQTUVXWZ]^_acdfgi,H`+nopqrs,Ha+JMQTXbghijklmnopqrstuvwxyz{|}~,Hb+?@ABCDEFGHIJKLNOSUVZ[\\_`abcdehijklmnopqrstuvwxyz{|}~,Hc+?@ABCDEF,HR+hjmnrstvx{|~,HS+BAEFHILMNQRSTUWZ\\]^aijhkpqsuvw{}~,HTAHStHT+CDEHKMNQRSUVWXZ]^\\`acdefghijknpqr,HSyF^+fk,HZHFf+Tlbj,FgEDtFFg+BA]S,Hc+GHIJKMNPQRSTUVWXYZ[\\]^_`abcdefghijklnopqrstuvwxyz{|}~,Hd+?@ABCDEFGHIJKLMNOPQRUVWXYZ[\\]^_`acerwxz},He+ABH,Fg+xv,FhPHzNHedFhoFY+GMRXc,FR+]_,FSkHw+_aghijkqpuwvxy},Hx+@ACEFGHJKMPTVYZ[]befghijkplr,FU+QSU_\\kbrsw,FVCFU+po,FV+BAULbgecjf,FWBFV+p{~,FW+O?DKVIdWTX,He+KMYZ[\\]^_`abcefhijklmnopqrstuvwxyz{|}~,Hf+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwx,FW+Z{a_,FX?FW+lo~t,FXBFW+}r,FX+L]S[Ujn,F~IFjeFh+wx,Fi+?EGTe_kglr,G`+chq|~,Ga+Aa,GbEGa+v{,Gb+HaMbdp,GcYGb+{g}o,Gc+`XRZIsju,Gd+@ez,FUJGBdFY+qs,F^[G?+QSU[_adefhgpJt,G@+BELQhp,GeBH`wHa+?B,Hf+yz{|}~,Hg+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,Hh+?@ABCDEFGHIJKLMNOPQRSTUVWX,Ha+HKLNSYZ]^`ade,GX+LSkm~y{z,GY+gLJk\\fbiRhu,GZCGYtGZMGY+oypn,GZ+HN,GYsGZ+hpqlrO,G[RGZ+]s^WP,G[+BF,GZwG[+GILHbz]dmY},G\\GG[+sphv~,G]AG[aG\\+|}z_oKm,G]JG\\+Rb{cXd,G]+Rng,G^QHh+YZ[\\]^_`abcdefghijq,Hi+BHLMSTXehijklmnqrstxz|}~,Hj+BCEFGHILMNOQSTUVXYZ[\\]_abcdfghikmopqrstuvwy{|}~,Hk+?@ACDE,G^EG]+GDlVBj,G^dG]+ktr,G^+JR,G]|G^+P?IZi_m,G_+UR,G^}G_+IZ`x{,F{uF|+ACD,GGOFj+y|,Fk+GBCTIjN,FlFFk+wiXmp_dcr}],Fl+WYDtK\\_mzaqp,Fm+Oefwk\\gDi[ajs,Fn+P@K\\Ydei,FoKFn+}{,Fo+NUJ,Hk+FHIJKLMOPQSTUVWXYZ[\\]_`acdefghijklmoprstuvwxy|}~,Hl+?EIJKMOQRTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz,Fo+^iew,Fp+@?,GF}GG+@AC,GFkG`CGG+`ablngjwzrs},GH+CHJNY^g,G`}Ga+DG,Gb+W^,Gd]F}+\\^fnoq,Fp{ETHFq+P\\[]aq{|,Fr+@FKLGDVg,GHmEYgF}~F~+MTd`ehmr,FrwFtvFu+em,FxFFyZHy+ws,GtrGu+CSPp,Gt+fl,Gp+FH,HD+IOMNc,Hl+{|}~,Hm+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,Hn+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ,HD+a`ohn|}qsx,HE+KDOLPabilmntsy,GpTHx}GuwGvjGwDGx+Xh,Gu+t~{y,Gv+CUVY]MNZEkvwbxzc,GwHGv|Gw+S\\^kmbny,Gx?Gw+xt|p,Gx+H@APQIou{ns,Gy+DNSO[],GpwGq+AIDWS,EUZGf+U]Y[,Hn+[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,Ho+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz,Gf+djn,Gg}GkeH\\RHZ+hrn,H[+E@GNMilo},H}+?BDEFGHIK,Hz}H{+JL,HY+x{|,HZ+MQ,F]~HZ_HI+Mm,HJGHK}HLiHNIHMNHO}HPjHp~Hq+ADEFG,FgbHq+JMOPQSTYZ]^_`abdefghjlmopqrstuvyz{|,Hr+CDEFIJ,Ho+{|}~,Hp+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz|},Hq+?BCHIKNRUVWX\\iknx}~,Hr+?@AGHPQYZ_`KLMNORSTVWX[\\^a,H\\{H]+DPQSnjbqs,Hi+pov,HxWHi+uy{,Hj+@?DAJKP,Hl+DBFHGLP,HbgHc+Lm,Hd+TS,Hj+^`enjzlx,Hk+GNR^b,Hy+|},FwzHy+AFGJQ,HNUHy+\\^,Hz+Z[\\_^ahfdin,H{+aknxv|},H|CHr+bcdefghijklmnopqrstuvwxyz{|}~,Hs+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,Ht+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,Hu+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,Hv+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,Hw+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]cfmosz{,Hx+?LOQRSUX\\^_`admnqstuvwxyz{|,Hy+?@BCDEHIKLMNOPSTUVWXYZ[]_`abcdfghijklmnopqrtuvxy{~,Hz+?@ABDEFGIJKOQRTUVXY]`bcegjklmopqrstuvwy|~,H{+?@ABCDEFGHIKNPQSTUWYZ[\\]^`bcdefghijlmopqrstuwy{~,H|+?@ABDEFGHIJKLMNQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|},H}+@ALMNOPQRSTUVW[\\]`abcd,NckNdxNeTNf+fp,Ng+KLMNPRSW^_`bcfgh,M_+TUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~,M`+?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abc"));

		// 以Unicode编码顺序排列的编码映射数组
		var data_sort_unicode = data_sort_gbk.slice(0).sort(function (a, b) { return a[0] - b[0]; });

		/**
		 * 查询映射码
		 * @param {uint32} charCode 
		 * @param {bool} isgbk 
		 */
		function search(charCode, isgbk) {
			var k = 0,
				v = 1,
				arr = data_sort_unicode;
			isgbk && (k = 1, v = 0, arr = data_sort_gbk);

			// 二分法搜索
			var i,
				b = 0,
				e = arr.length - 1;

			while (b <= e) {
				i = ~~((b + e) / 2);
				var _i = arr[i][k];
				if (_i > charCode) {
					e = --i;
				} else if (_i < charCode) {
					b = ++i;
				} else {
					return arr[i][v];
				}
			}
			return -1;
		}

		return {
			encode: function (str) {
				var gbk = [];
				var wh = '?'.charCodeAt(0);
				for (var i = 0; i < str.length; i++) {
					var charcode = str.charCodeAt(i);
					if (charcode < 0x80) gbk.push(charcode)
					else {
						var gcode = search(charcode)
						if (~gcode) {
							gbk.push(0xFF & (gcode >> 8), 0xFF & gcode);
						} else {
							gbk.push(wh);
						}
					}
				}
				return gbk;
			},
			decode: function (arr) {
				var kb = '', str = "";
				for (var n = 0, max = arr.length; n < max; n++) {
					var Code = arr[n];
					if (Code & 0x80) {
						Code = search(Code << 8 | arr[++n], true);
					}
					str += String.fromCharCode(Code);
				}
				return str;
			}
		};

	}();
	
	return GBK;
}))
},{}]},{},[1])