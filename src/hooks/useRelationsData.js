import { useEffect, useState } from "react";
import { moduleServices } from "../services";
import { resolveFieldValue } from "../utils/format";

function getOptionLabel(item, labelFields = []) {
  const values = labelFields
    .map((field) => resolveFieldValue(item, field))
    .filter((value) => value !== null && value !== undefined && String(value).trim() !== "")
    .map((value) => String(value));

  return values.join(" ").trim() || "Sin nombre";
}

export function useRelationsData(config) {
  const [relationData, setRelationData] = useState({});

  useEffect(() => {
    const relations = config.relations || {};
    const relationKeys = Object.keys(relations);

    if (!relationKeys.length) {
      setRelationData({});
      return;
    }

    const load = async () => {
      const entries = await Promise.all(
        relationKeys.map(async (relationKey) => {
          const relationConfig = relations[relationKey];
          const service = moduleServices[relationConfig.sourceModule];
          const methodName = relationConfig.method || "findAll";
          const method = service?.[methodName] || service?.findAll;

          if (!method) return [relationKey, []];

          try {
            const result = await method();
            let items = Array.isArray(result) ? result : [];

            if (relationConfig.filterField && relationConfig.filterEquals !== undefined) {
              items = items.filter(
                (item) =>
                  String(resolveFieldValue(item, relationConfig.filterField)) ===
                  String(relationConfig.filterEquals)
              );
            }

            const options = items.map((item) => ({
              value: resolveFieldValue(item, relationConfig.valueField),
              label: getOptionLabel(item, relationConfig.labelFields),
              raw: item
            }));

            return [relationKey, options.filter((option) => option.value !== undefined && option.value !== null)];
          } catch {
            return [relationKey, []];
          }
        })
      );

      setRelationData(Object.fromEntries(entries));
    };

    load();
  }, [config]);

  return relationData;
}
