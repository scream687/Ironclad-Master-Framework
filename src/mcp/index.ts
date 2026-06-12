import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { IroncladKernel } from "../core/kernel/ironclad-kernel.js";
import { StrategicPlanningDomain } from "../core/domains/strategic-planning/strategic-planning.domain.js";
import { GeneratePlanUseCase } from "../core/application/use-cases/generate-plan.use-case.js";
import { BrainstormUseCase } from "../core/application/use-cases/brainstorm.use-case.js";
import { TaskManagementDomain } from "../core/domains/task-management/task-management.domain.js";
import { QualityAssuranceDomain } from "../core/domains/quality-assurance/quality-assurance.domain.js";
import { IntelligenceHubDomain } from "../core/domains/intelligence-hub/intelligence-hub.domain.js";
import { MemoryDomain } from "../core/domains/memory/memory.domain.js";
import { AutomationDomain } from "../core/domains/automation/automation.domain.js";
import { BootstrappingDomain } from "../core/domains/bootstrapping/bootstrapping.domain.js";

export async function runMcpServer() {
  const kernel = new IroncladKernel();
  
  // Load Domains
  await kernel.loadDomain(new TaskManagementDomain());
  await kernel.loadDomain(new QualityAssuranceDomain());
  await kernel.loadDomain(new IntelligenceHubDomain());
  await kernel.loadDomain(new MemoryDomain());
  await kernel.loadDomain(new AutomationDomain());
  await kernel.loadDomain(new BootstrappingDomain());
  await kernel.loadDomain(new StrategicPlanningDomain());

  // Register Use Cases
  kernel.getContainer().bind(GeneratePlanUseCase).toSelf().inSingletonScope();
  kernel.getContainer().bind(BrainstormUseCase).toSelf().inSingletonScope();

  const server = new Server(
    {
      name: "ironclad-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "ironclad_plan",
          description: "Generate a strategic SPARC specification for a goal.",
          inputSchema: {
            type: "object",
            properties: {
              goal: {
                type: "string",
                description: "The goal of the plan",
              },
              context: {
                type: "string",
                description: "Additional context for the plan",
              },
            },
            required: ["goal"],
          },
        },
        {
          name: "ironclad_brainstorm",
          description: "Generate creative strategies or ideas for a topic.",
          inputSchema: {
            type: "object",
            properties: {
              topic: {
                type: "string",
                description: "The topic to brainstorm",
              },
            },
            required: ["topic"],
          },
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      if (name === "ironclad_plan") {
        const useCase = kernel.getContainer().get(GeneratePlanUseCase);
        const { goal, context } = args as { goal: string; context?: string };
        const result = await useCase.execute(goal, context || "");
        return {
          content: [
            {
              type: "text",
              text: `Plan generated at ${result.path}\n\n${result.content}`,
            },
          ],
        };
      } else if (name === "ironclad_brainstorm") {
        const useCase = kernel.getContainer().get(BrainstormUseCase);
        const { topic } = args as { topic: string };
        const ideas = await useCase.execute(topic);
        return {
          content: [
            {
              type: "text",
              text: `Brainstorming complete for: ${topic}\n\n${ideas.map((idea, i) => `${i + 1}. ${idea}`).join("\n")}`,
            },
          ],
        };
      } else {
        throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Ironclad MCP Server running on stdio");
}
