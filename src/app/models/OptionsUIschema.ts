import { JsonSchema } from "@jsonforms/core";

export class OptionsUIschema{
    jsonSchema: JsonSchema = null;
    numColumns: number = 2;
    isGrouped = false;
    title: string = "";
    layoutType = "VerticalLayout";
    prefix = "#";
    rootSchema: JsonSchema = this.jsonSchema;

    public constructor(init?:Partial<OptionsUIschema>){
        Object.assign(this, init);
    }
}