import { db } from "~/.server/db";
import { indicators, iocs } from "~/.server/schema";
import { createId } from '@paralleldrive/cuid2'

interface addIOCResult {
    errors: { error: boolean; type: string; value: string };
    indicator: Indicator;
}

export const addIOC = async (formData: FormData, analysis_workspace_id: string): Promise<addIOCResult> => {
    const formIndicator = formData.get("indicator");
    const formType = formData.get("type");
  
    let indicator: Indicator = { value: "", type: "ip" };
  
    const errors: { error: boolean; type: string; value: string } = {
      error: false,
      type: "",
      value: "",
    };
  
    if (
      formType &&
      !["ip", "domain", "hash", "url"].includes(formType as string)
    ) {
      errors.type = "Invalid Indicator Type";
    }
  
    if (formIndicator && formType) {
      indicator = {
        value: formIndicator as string,
        type: formType as "ip" | "domain" | "hash" | "url",
      };
    }
  
    // regex matching for ip, domain, hash, url
    switch (indicator.type) {
      case "ip":
        if (
          !/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
            indicator.value
          ) ||
          indicator.value === "0.0.0.0"
        ) {
          errors.value = "Invalid IP Address";
        }
        break;
      case "domain":
        if (
          !/^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/.test(
            indicator.value
          )
        ) {
          errors.value = "Invalid Domain";
        }
        break;
      case "hash":
        if (!/\b[a-fA-F0-9]{32,128}\b/.test(indicator.value)) {
          errors.value = "Invalid Hash";
        }
        break;
      case "url":
        if (
          !/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi.test(
            indicator.value
          )
        ) {
          errors.value = "Invalid URL";
        }
        break;
      default:
        break;
    }
  
    if (errors.type !== "" || errors.value !== "") {
      errors.error = true;
    } else {
      // save to database
      // TODO: Also store the indicator in iocs table and not just the indicators, which is shared for all workspaces and projects

      console.log('ws', analysis_workspace_id)

      if (analysis_workspace_id === "") {
        return { errors, indicator }; // throw error regarding analysis
      }
      await db.insert(indicators).values({
        indicator: indicator.value,
        type: indicator.type,
      }).onConflictDoNothing({ target: indicators.indicator });

      await db.insert(iocs).values({
        id: createId(),
        indicator: indicator.value,
        analysis_workspace_id: analysis_workspace_id,
      });
    }

    return {errors, indicator}
  }