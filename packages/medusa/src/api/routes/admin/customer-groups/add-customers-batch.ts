import { Type } from "class-transformer"
import { IsObject, IsOptional, IsString, ValidateNested } from "class-validator"
import { CustomerGroupService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /customer-groups/{id}/
 * operationId: "PostCustomerGroupsBatch"
 * summary: "Add a list of customers to a customer group "
 * description: "Adds a list of customers, represented by id's, to a customer group."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the customer group.
 *   - (body) customers=* {{id: string }[]} ids of the customers to add
 * tags:
 *   - CustomerGroup
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             customerGroup:
 *               $ref: "#/components/schemas/customergroup"
 */

export default async (req, res) => {
  const { id } = req.params
  const validated = await validator(AdminPostCustomerGroupsBatchReq, req.body)

  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )

  const customerGroup = await customerGroupService.addCustomerBatch(
    id,
    validated
  )
  res.status(200).json({ customerGroup })
}

class AdminPostCustomerGroupsBatchReqCustomer {
  @IsString()
  id: string
}

export class AdminPostCustomerGroupsBatchReq {
  @ValidateNested({ each: true })
  @Type(() => AdminPostCustomerGroupsBatchReqCustomer)
  customerIds: AdminPostCustomerGroupsBatchReqCustomer[]
}
