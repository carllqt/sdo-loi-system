import {
    Document,
    Font,
    Image,
    Page,
    Text,
    View,
} from "@react-pdf/renderer";
import regularFont from "../../../../../public/fonts/loi/times.ttf?url";
import boldFont from "../../../../../public/fonts/loi/timesbd.ttf?url";

Font.register({
    family: "LOI Times New Roman",
    fonts: [
        { src: regularFont, fontWeight: 400 },
        { src: boldFont, fontWeight: 700 },
    ],
});
Font.registerHyphenationCallback((word) => [word]);

// All layout values are PDF points (72 points = 1 inch).
// This is the only LOI layout, shared by printing, PDF and the testing window.
const INCH = 72;
const CM = INCH / 2.54;
export const LOI_PAGE_SIZE = [8.5 * INCH, 13 * INCH];


export default function RequestLetterPrint({
    request,
    assetBasePath = "",
    title = "Letter of Introduction",
}) {
    if (!request) return null;
    const middleInitial = request.middle_name?.trim()?.charAt(0);
    const name = [
        request.first_name,
        middleInitial ? `${middleInitial}.` : null,
        request.last_name,
    ]
        .filter(Boolean)
        .join(" ")
        .toLocaleUpperCase("en-PH");
    const honorific =
        request.gender === "Female"
            ? "Ms."
            : request.gender === "Male"
              ? "Mr."
              : "";
    const introductionName = [honorific.toUpperCase(), name]
        .filter(Boolean)
        .join(" ");
    const storedLastName = request.last_name?.trim() ?? "";
    const lastName =
        storedLastName === storedLastName.toLocaleUpperCase("en-PH")
            ? storedLastName
                  .toLocaleLowerCase("en-PH")
                  .replace(/(^|[\s'’-])\p{L}/gu, (letter) =>
                      letter.toLocaleUpperCase("en-PH"),
                  )
            : storedLastName;
    const acknowledgmentName = [honorific, lastName].filter(Boolean).join(" ");
    const formattedDate = new Intl.DateTimeFormat("en-PH", {
        timeZone: "Asia/Manila",
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date());

    return (
        <Document title={title} language="en-PH">
            <Page size={LOI_PAGE_SIZE} style={{
                paddingTop: 2.22 * INCH,
                paddingBottom: 0.98 * INCH + 0.5 * CM,
                paddingHorizontal: INCH,
                fontFamily: "LOI Times New Roman",
                fontSize: 12,
                lineHeight: 1.3,
                color: "#111111",
                backgroundColor: "#ffffff",
            }}>
                <Image
                    fixed
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 8.5 * INCH,
                        height: 2.22 * INCH,
                        objectFit: "fill",
                    }}
                    src={`${assetBasePath}/sdo-header.png`}
                />
                <Text style={{
                    marginTop: 21,
                    marginHorizontal: 21,
                    marginBottom: 21,
                    textAlign: "center",
                    fontSize: 14,
                    lineHeight: 1.2,
                    fontWeight: 700,
                }}>LETTER OF INTRODUCTION</Text>
                <Text style={{ marginBottom: 0.3 * INCH, textAlign: "right" }}>{formattedDate}</Text>
                <View wrap={false}>
                    <Text style={{ fontWeight: 700 }}>THE MANAGER</Text>
                    <Text>LANDBANK OF THE PHILIPPINES</Text>
                    <Text>Ilagan, Branch</Text>
                </View>
                <Text style={{ marginTop: 21, marginRight: 21, marginBottom: 21 }}>Sir/Madam:</Text>
                <Text style={{ textIndent: 0.45 * INCH, marginBottom: 0.16 * INCH }}>
                    This is to introduce{" "}
                    <Text style={{ fontWeight: 700 }}>{introductionName}</Text>,{" "}
                    {request.position} of {request.school}, of the City of
                    Ilagan, City of Ilagan, Isabela
                </Text>
                <Text style={{ textIndent: 0.45 * INCH }}>
                    Kindly acknowledge the specimen signature of{" "}
                    {acknowledgmentName} written below for Account Opening.
                </Text>
                <View style={{ marginTop: 30, marginBottom: 30, width: "100%" }} wrap={false}>
                    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                        <Text style={{
                            width: "45%",
                            paddingRight: 0.08 * INCH,
                            paddingBottom: 0.04 * INCH,
                            textDecoration: "underline",
                        }}>
                            Name
                        </Text>
                        <Text style={{
                            width: "35%",
                            paddingRight: 0.08 * INCH,
                            paddingBottom: 0.04 * INCH,
                            textDecoration: "underline",
                        }}>
                            Position
                        </Text>
                        <Text style={{
                            width: "30%",
                            paddingRight: 0.08 * INCH,
                            paddingBottom: 0.04 * INCH,
                            textDecoration: "underline",
                        }}>
                            Signature
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                        <Text
                            style={{
                                width: "45%",
                                paddingRight: 0.08 * INCH,
                                paddingBottom: 0.04 * INCH,
                                paddingTop: 24,
                                fontWeight: 700,
                            }}
                        >
                            {name}
                        </Text>
                        <Text style={{ width: "35%", paddingRight: 0.08 * INCH, paddingBottom: 0.04 * INCH, paddingTop: 24 }}>
                            {request.position}
                        </Text>
                        <View style={{ width: "30%", paddingRight: 0.08 * INCH, paddingBottom: 0.04 * INCH, paddingTop: 24 }}>
                            <View style={{ width: 96, height: 0.24 * INCH, borderBottomWidth: 0.75, borderBottomColor: "#111111" }} />
                        </View>
                    </View>
                </View>
                <Text style={{ marginLeft: 24 }}>For your reference.</Text>
                <Text style={{ marginTop: 0.08 * INCH, marginLeft: 24 }}>Thank you.</Text>
                <Text style={{ marginTop: 0.2 * INCH, marginLeft: 270 }}>Very truly yours,</Text>
                <View style={{
                    marginTop: 0.38 * INCH,
                    marginRight: 24,
                    alignSelf: "flex-end",
                    width: "62%",
                    textAlign: "center",
                }} wrap={false}>
                    <Text style={{ fontWeight: 700 }}>
                        EDUARDO C. ESCORPISCO JR., EdD, CESO V
                    </Text>
                    <Text>Schools Division Superintendent</Text>
                </View>
                <Text style={{ marginTop: 0.25 * INCH, fontSize: 10 }}>
                    cjas/admin - {formattedDate}
                </Text>
                <Image
                    fixed
                    style={{
                        position: "absolute",
                        bottom: 0.5 * CM,
                        left: 0,
                        width: 8.5 * INCH,
                        height: 0.98 * INCH,
                        objectFit: "fill",
                    }}
                    src={`${assetBasePath}/sdo-footer.png`}
                />
            </Page>
        </Document>
    );
}
